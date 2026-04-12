"""
Export LAION Aesthetic Predictor V2.5 as a single ONNX model.

Creates an end-to-end model:
  Input:  "image" — float32 tensor (1, 3, 224, 224)
  Output: float32 tensor (1, 1) — aesthetic score in [0, 10]

The model combines:
  1. OpenCLIP ViT-L/14 visual encoder (produces 768-dim embedding)
  2. A small MLP head trained on the LAION Aesthetics V2 dataset

NOTE: The output file (misc/aesthetic_model/model.onnx) is NOT committed to
git because it is ~1.2 GB. You must generate it locally before running the
machine-learning service. Follow the steps below.

============================
SETUP / INSTALLATION STEPS
============================

1. Install Python dependencies (ideally in a virtual environment):

     pip install torch open_clip_torch huggingface_hub safetensors onnx

   Or, if you have a requirements file:

     pip install -r misc/requirements-export.txt

2. Run this script from the repo root:

     python misc/export_aesthetic_onnx.py

   This will:
     - Download OpenCLIP ViT-L/14 weights from OpenAI (~1.7 GB, cached by torch)
     - Download MLP head weights from HuggingFace Hub (~few MB, cached)
     - Export the combined model to:  misc/aesthetic_model/model.onnx

   Optionally pass a custom output directory:

     python misc/export_aesthetic_onnx.py /path/to/output/dir

3. The machine-learning service expects the model at:

     misc/aesthetic_model/model.onnx

   (configured via LAION_AESTHETIC_MODEL_PATH in machine-learning constants)

Requirements:
  - Python 3.10+
  - ~3 GB disk space (model + download cache)
  - Internet access (first run only; weights are cached after that)

============================

Usage:
  python misc/export_aesthetic_onnx.py
"""

import sys
import torch
import torch.nn as nn
import open_clip
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
from pathlib import Path


class AestheticPredictorV25(nn.Module):
    """Combined CLIP visual encoder + aesthetic MLP head."""

    def __init__(self, clip_model: nn.Module, mlp_head: nn.Module):
        super().__init__()
        self.clip_visual = clip_model.visual
        self.mlp_head = mlp_head

    def forward(self, image: torch.Tensor) -> torch.Tensor:
        # Get CLIP visual embedding and normalize
        embedding = self.clip_visual(image)
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)
        # Score via MLP head
        score = self.mlp_head(embedding)
        return score


def build_mlp_head(input_dim: int = 768) -> nn.Module:
    """Build the MLP head architecture matching aesthetic-predictor-v2-5."""
    return nn.Sequential(
        nn.Linear(input_dim, 1024),
        nn.Dropout(0.2),
        nn.Linear(1024, 128),
        nn.Dropout(0.2),
        nn.Linear(128, 64),
        nn.Dropout(0.1),
        nn.Linear(64, 16),
        nn.Linear(16, 1),
    )


def main():
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("misc/aesthetic_model")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "model.onnx"

    print("Step 1: Loading OpenCLIP ViT-L/14 (openai pretrained)...")
    clip_model, _, _ = open_clip.create_model_and_transforms(
        "ViT-L-14", pretrained="openai"
    )
    clip_model.eval()

    print("Step 2: Downloading MLP head weights from HuggingFace...")
    mlp_weights_path = hf_hub_download(
        repo_id="shunk031/aesthetics-predictor-v2-sac-logos-ava1-l14-linearMSE",
        filename="model.safetensors",
    )

    print("Step 3: Building MLP head and loading weights...")
    mlp_head = build_mlp_head(768)
    state_dict = load_file(mlp_weights_path)

    # The HF safetensors bundles the full CLIP + MLP head.
    # Extract only MLP head keys (layers.*) and map to Sequential indices.
    mapped_state_dict = {}
    for key, value in state_dict.items():
        if key.startswith("layers."):
            new_key = key.replace("layers.", "")
            mapped_state_dict[new_key] = value

    mlp_head.load_state_dict(mapped_state_dict)
    mlp_head.eval()

    print("Step 4: Combining into single model and exporting ONNX...")
    combined = AestheticPredictorV25(clip_model, mlp_head)
    combined.eval()

    dummy_input = torch.randn(1, 3, 224, 224)

    with torch.no_grad():
        test_output = combined(dummy_input)
        print(f"  Test output shape: {test_output.shape}, value: {test_output.item():.4f}")

    torch.onnx.export(
        combined,
        dummy_input,
        str(output_path),
        input_names=["image"],
        output_names=["score"],
        dynamic_axes={"image": {0: "batch"}, "score": {0: "batch"}},
        opset_version=17,
    )

    print(f"Done! ONNX model saved to: {output_path}")
    print(f"  File size: {output_path.stat().st_size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()

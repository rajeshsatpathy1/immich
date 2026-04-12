from __future__ import annotations

import numpy as np
from numpy.typing import NDArray
from PIL import Image

from immich_ml.config import log
from immich_ml.models.base import InferenceModel
from immich_ml.models.transforms import (
    crop_pil,
    decode_pil,
    normalize,
    resize_pil,
    to_numpy,
)
from immich_ml.schemas import ModelSession, ModelTask, ModelType

# LAION aesthetic predictor v2 expects 224x224 images preprocessed with
# the standard CLIP ViT-L/14 mean/std.
_AESTHETIC_SIZE = 224
_AESTHETIC_MEAN = np.array([0.48145466, 0.4578275, 0.40821073], dtype=np.float32)
_AESTHETIC_STD = np.array([0.26862954, 0.26130258, 0.27577711], dtype=np.float32)


class LaionAestheticPredictor(InferenceModel):
    """Pluggable aesthetic scoring model.

    Input : a single image (path bytes or PIL Image).
    Output: a float in [0, 10] representing the predicted aesthetic score.

    The model is a two-stage ONNX pipeline:
      1. A CLIP ViT-L/14 visual encoder (produces a 768-dim embedding).
      2. A small MLP head trained on the LAION Aesthetics V2 dataset that
         maps the embedding to a scalar score.

    Both stages are bundled as a single ONNX session whose input is a
    (1, 3, 224, 224) float32 image tensor and whose output is a (1, 1)
    float32 score tensor.

    To swap in a different aesthetic model, implement the same
    ``InferenceModel`` interface with
    ``identity = (ModelType.SCORING, ModelTask.AESTHETIC)`` and register
    it in ``immich_ml/models/__init__.py``.
    """

    depends = []
    identity = (ModelType.SCORING, ModelTask.AESTHETIC)

    def _load(self) -> ModelSession:
        session = super()._load()
        log.debug(f"Loaded aesthetic predictor model '{self.model_name}'")
        return session

    def _predict(self, inputs: Image.Image | bytes) -> float:
        image = decode_pil(inputs)
        image_tensor = self._preprocess(image)
        output: NDArray[np.float32] = self.session.run(None, {"image": image_tensor})[0]
        score: float = float(np.clip(output[0][0], 0.0, 10.0))
        return score

    def _preprocess(self, image: Image.Image) -> NDArray[np.float32]:
        image = resize_pil(image, _AESTHETIC_SIZE)
        image = crop_pil(image, _AESTHETIC_SIZE)
        image_np = to_numpy(image)
        image_np = normalize(image_np, _AESTHETIC_MEAN, _AESTHETIC_STD)
        # (H, W, C) → (1, C, H, W)
        return np.expand_dims(image_np.transpose(2, 0, 1), 0)

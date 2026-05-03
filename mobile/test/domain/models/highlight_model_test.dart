import 'package:flutter_test/flutter_test.dart';
import 'package:immich_mobile/domain/models/highlight.model.dart';

import '../../test_utils.dart';

void main() {
  group('Highlight', () {
    group('coverAsset', () {
      test('returns null when the highlight has no assets', () {
        final highlight = _createHighlight(assets: const []);

        expect(highlight.coverAsset, isNull);
      });

      test('returns the first asset when no thumbnail asset id is set', () {
        final firstAsset = TestUtils.createRemoteAsset(id: 'asset-1');
        final secondAsset = TestUtils.createRemoteAsset(id: 'asset-2');
        final highlight = _createHighlight(assets: [firstAsset, secondAsset]);

        expect(highlight.coverAsset, same(firstAsset));
      });

      test('returns the thumbnail asset when it exists in the asset list', () {
        final firstAsset = TestUtils.createRemoteAsset(id: 'asset-1');
        final thumbnailAsset = TestUtils.createRemoteAsset(id: 'asset-2');
        final highlight = _createHighlight(
          thumbnailAssetId: thumbnailAsset.id,
          assets: [firstAsset, thumbnailAsset],
        );

        expect(highlight.coverAsset, same(thumbnailAsset));
      });

      test('falls back to the first asset when the thumbnail asset is missing', () {
        final firstAsset = TestUtils.createRemoteAsset(id: 'asset-1');
        final secondAsset = TestUtils.createRemoteAsset(id: 'asset-2');
        final highlight = _createHighlight(
          thumbnailAssetId: 'missing-asset',
          assets: [firstAsset, secondAsset],
        );

        expect(highlight.coverAsset, same(firstAsset));
      });
    });

    group('copyWith', () {
      test('applies overrides and preserves untouched fields', () {
        final original = _createHighlight();
        final updatedAt = DateTime(2024, 2, 1);
        final updatedAssets = [
          TestUtils.createRemoteAsset(id: 'asset-3'),
        ];

        final copy = original.copyWith(
          name: 'Updated highlight',
          isPinned: true,
          updatedAt: updatedAt,
          assets: updatedAssets,
        );

        expect(copy.id, original.id);
        expect(copy.name, 'Updated highlight');
        expect(copy.description, original.description);
        expect(copy.isPinned, isTrue);
        expect(copy.type, original.type);
        expect(copy.ownerId, original.ownerId);
        expect(copy.updatedAt, updatedAt);
        expect(copy.assets, same(updatedAssets));
      });
    });

    group('equality', () {
      test('uses deep equality for assets and matches hashCode for identical values', () {
        final asset1 = TestUtils.createRemoteAsset(id: 'asset-1');
        final asset2 = TestUtils.createRemoteAsset(id: 'asset-2');
        final left = _createHighlight(assets: [asset1, asset2]);
        final right = _createHighlight(assets: [asset1.copyWith(), asset2.copyWith()]);

        expect(left, right);
        expect(left.hashCode, right.hashCode);
      });

      test('detects differences in values', () {
        final left = _createHighlight();
        final right = _createHighlight(isPinned: true);

        expect(left == right, isFalse);
      });
    });
  });
}

Highlight _createHighlight({
  String id = 'highlight-1',
  String name = 'Weekend trip',
  String description = 'A curated set of favorite moments',
  bool isPinned = false,
  HighlightTypeEnum type = HighlightTypeEnum.manual,
  String ownerId = 'owner-1',
  String? sourceTagId,
  String? thumbnailAssetId,
  DateTime? createdAt,
  DateTime? updatedAt,
  List<dynamic>? assets,
}) {
  return Highlight(
    id: id,
    name: name,
    description: description,
    isPinned: isPinned,
    type: type,
    ownerId: ownerId,
    sourceTagId: sourceTagId,
    thumbnailAssetId: thumbnailAssetId,
    createdAt: createdAt ?? DateTime(2024, 1, 1),
    updatedAt: updatedAt ?? DateTime(2024, 1, 2),
    assets: (assets ?? [TestUtils.createRemoteAsset(id: 'asset-1')]).cast(),
  );
}

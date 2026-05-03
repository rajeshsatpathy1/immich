// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:collection/collection.dart';

import 'package:immich_mobile/domain/models/asset/base_asset.model.dart';

enum HighlightTypeEnum {
  // do not change this order!
  manual,
  auto,
}

class Highlight {
  final String id;
  final String name;
  final String description;
  final bool isPinned;
  final HighlightTypeEnum type;
  final String ownerId;
  final String? sourceTagId;
  final String? thumbnailAssetId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<RemoteAsset> assets;

  const Highlight({
    required this.id,
    required this.name,
    required this.description,
    required this.isPinned,
    required this.type,
    required this.ownerId,
    this.sourceTagId,
    this.thumbnailAssetId,
    required this.createdAt,
    required this.updatedAt,
    required this.assets,
  });

  Highlight copyWith({
    String? id,
    String? name,
    String? description,
    bool? isPinned,
    HighlightTypeEnum? type,
    String? ownerId,
    String? sourceTagId,
    String? thumbnailAssetId,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<RemoteAsset>? assets,
  }) {
    return Highlight(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      isPinned: isPinned ?? this.isPinned,
      type: type ?? this.type,
      ownerId: ownerId ?? this.ownerId,
      sourceTagId: sourceTagId ?? this.sourceTagId,
      thumbnailAssetId: thumbnailAssetId ?? this.thumbnailAssetId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      assets: assets ?? this.assets,
    );
  }

  /// Thumbnail asset, if set; otherwise the first asset in the list.
  RemoteAsset? get coverAsset {
    if (assets.isEmpty) return null;
    if (thumbnailAssetId == null) return assets.first;
    return assets.firstWhereOrNull((a) => a.id == thumbnailAssetId) ?? assets.first;
  }

  @override
  String toString() {
    return 'Highlight { id: $id, name: $name, isPinned: $isPinned, type: $type, assets: ${assets.length} }';
  }

  @override
  bool operator ==(covariant Highlight other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other.id == id &&
        other.name == name &&
        other.description == description &&
        other.isPinned == isPinned &&
        other.type == type &&
        other.ownerId == ownerId &&
        other.sourceTagId == sourceTagId &&
        other.thumbnailAssetId == thumbnailAssetId &&
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt &&
        listEquals(other.assets, assets);
  }

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      isPinned.hashCode ^
      type.hashCode ^
      ownerId.hashCode ^
      sourceTagId.hashCode ^
      thumbnailAssetId.hashCode ^
      createdAt.hashCode ^
      updatedAt.hashCode ^
      const DeepCollectionEquality().hash(assets);
}

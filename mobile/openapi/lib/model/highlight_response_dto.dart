//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HighlightResponseDto {
  /// Returns a new [HighlightResponseDto] instance.
  HighlightResponseDto({
    this.assets = const [],
    required this.createdAt,
    required this.description,
    required this.id,
    required this.isPinned,
    required this.name,
    required this.ownerId,
    required this.sourceTagId,
    required this.thumbnailAssetId,
    required this.type,
    required this.updatedAt,
  });

  /// Assets in highlight
  List<AssetResponseDto> assets;

  /// Creation date
  DateTime createdAt;

  /// Highlight description
  String description;

  /// Highlight ID
  String id;

  /// Is highlight pinned
  bool isPinned;

  /// Highlight name
  String name;

  /// Owner user ID
  String ownerId;

  /// Source tag ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? sourceTagId;

  /// Thumbnail asset ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? thumbnailAssetId;

  /// Highlight type
  HighlightType type;

  /// Last update date
  DateTime updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HighlightResponseDto &&
    _deepEquality.equals(other.assets, assets) &&
    other.createdAt == createdAt &&
    other.description == description &&
    other.id == id &&
    other.isPinned == isPinned &&
    other.name == name &&
    other.ownerId == ownerId &&
    other.sourceTagId == sourceTagId &&
    other.thumbnailAssetId == thumbnailAssetId &&
    other.type == type &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (assets.hashCode) +
    (createdAt.hashCode) +
    (description.hashCode) +
    (id.hashCode) +
    (isPinned.hashCode) +
    (name.hashCode) +
    (ownerId.hashCode) +
    (sourceTagId == null ? 0 : sourceTagId!.hashCode) +
    (thumbnailAssetId == null ? 0 : thumbnailAssetId!.hashCode) +
    (type.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'HighlightResponseDto[assets=$assets, createdAt=$createdAt, description=$description, id=$id, isPinned=$isPinned, name=$name, ownerId=$ownerId, sourceTagId=$sourceTagId, thumbnailAssetId=$thumbnailAssetId, type=$type, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'assets'] = this.assets;
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'description'] = this.description;
      json[r'id'] = this.id;
      json[r'isPinned'] = this.isPinned;
      json[r'name'] = this.name;
      json[r'ownerId'] = this.ownerId;
    if (this.sourceTagId != null) {
      json[r'sourceTagId'] = this.sourceTagId;
    } else {
    //  json[r'sourceTagId'] = null;
    }
    if (this.thumbnailAssetId != null) {
      json[r'thumbnailAssetId'] = this.thumbnailAssetId;
    } else {
    //  json[r'thumbnailAssetId'] = null;
    }
      json[r'type'] = this.type;
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [HighlightResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HighlightResponseDto? fromJson(dynamic value) {
    upgradeDto(value, "HighlightResponseDto");
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return HighlightResponseDto(
        assets: AssetResponseDto.listFromJson(json[r'assets']),
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        description: mapValueOfType<String>(json, r'description')!,
        id: mapValueOfType<String>(json, r'id')!,
        isPinned: mapValueOfType<bool>(json, r'isPinned')!,
        name: mapValueOfType<String>(json, r'name')!,
        ownerId: mapValueOfType<String>(json, r'ownerId')!,
        sourceTagId: mapValueOfType<String>(json, r'sourceTagId'),
        thumbnailAssetId: mapValueOfType<String>(json, r'thumbnailAssetId'),
        type: HighlightType.fromJson(json[r'type'])!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
      );
    }
    return null;
  }

  static List<HighlightResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HighlightResponseDto> mapFromJson(dynamic json) {
    final map = <String, HighlightResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HighlightResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HighlightResponseDto-objects as value to a dart map
  static Map<String, List<HighlightResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HighlightResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HighlightResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'assets',
    'createdAt',
    'description',
    'id',
    'isPinned',
    'name',
    'ownerId',
    'sourceTagId',
    'thumbnailAssetId',
    'type',
    'updatedAt',
  };
}

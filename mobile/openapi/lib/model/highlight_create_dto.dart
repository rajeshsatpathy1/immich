//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HighlightCreateDto {
  /// Returns a new [HighlightCreateDto] instance.
  HighlightCreateDto({
    this.assetIds = const [],
    this.description,
    this.isPinned,
    required this.name,
    this.sourceTagId,
    required this.type,
  });

  /// Asset IDs to include in highlight
  List<String> assetIds;

  /// Highlight description
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// Pin this highlight
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isPinned;

  /// Highlight name
  String name;

  /// Source tag ID for auto-curated highlights
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? sourceTagId;

  /// Highlight type
  HighlightType type;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HighlightCreateDto &&
    _deepEquality.equals(other.assetIds, assetIds) &&
    other.description == description &&
    other.isPinned == isPinned &&
    other.name == name &&
    other.sourceTagId == sourceTagId &&
    other.type == type;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (assetIds.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (isPinned == null ? 0 : isPinned!.hashCode) +
    (name.hashCode) +
    (sourceTagId == null ? 0 : sourceTagId!.hashCode) +
    (type.hashCode);

  @override
  String toString() => 'HighlightCreateDto[assetIds=$assetIds, description=$description, isPinned=$isPinned, name=$name, sourceTagId=$sourceTagId, type=$type]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'assetIds'] = this.assetIds;
    if (this.description != null) {
      json[r'description'] = this.description;
    }
    if (this.isPinned != null) {
      json[r'isPinned'] = this.isPinned;
    }
      json[r'name'] = this.name;
    if (this.sourceTagId != null) {
      json[r'sourceTagId'] = this.sourceTagId;
    }
      json[r'type'] = this.type;
    return json;
  }

  /// Returns a new [HighlightCreateDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HighlightCreateDto? fromJson(dynamic value) {
    upgradeDto(value, "HighlightCreateDto");
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return HighlightCreateDto(
        assetIds: json[r'assetIds'] is Iterable
            ? (json[r'assetIds'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        description: mapValueOfType<String>(json, r'description'),
        isPinned: mapValueOfType<bool>(json, r'isPinned'),
        name: mapValueOfType<String>(json, r'name')!,
        sourceTagId: mapValueOfType<String>(json, r'sourceTagId'),
        type: HighlightType.fromJson(json[r'type'])!,
      );
    }
    return null;
  }

  static List<HighlightCreateDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightCreateDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightCreateDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HighlightCreateDto> mapFromJson(dynamic json) {
    final map = <String, HighlightCreateDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HighlightCreateDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HighlightCreateDto-objects as value to a dart map
  static Map<String, List<HighlightCreateDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HighlightCreateDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HighlightCreateDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'name',
    'type',
  };
}

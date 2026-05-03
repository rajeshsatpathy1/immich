//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HighlightUpdateDto {
  /// Returns a new [HighlightUpdateDto] instance.
  HighlightUpdateDto({
    this.description,
    this.isPinned,
    this.name,
    this.thumbnailAssetId,
  });

  /// Highlight description
  String? description;

  /// Pin this highlight
  bool? isPinned;

  /// Highlight name
  String? name;

  /// Thumbnail asset ID
  String? thumbnailAssetId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HighlightUpdateDto &&
    other.description == description &&
    other.isPinned == isPinned &&
    other.name == name &&
    other.thumbnailAssetId == thumbnailAssetId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (description == null ? 0 : description!.hashCode) +
    (isPinned == null ? 0 : isPinned!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (thumbnailAssetId == null ? 0 : thumbnailAssetId!.hashCode);

  @override
  String toString() => 'HighlightUpdateDto[description=$description, isPinned=$isPinned, name=$name, thumbnailAssetId=$thumbnailAssetId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.description != null) {
      json[r'description'] = this.description;
    }
    if (this.isPinned != null) {
      json[r'isPinned'] = this.isPinned;
    }
    if (this.name != null) {
      json[r'name'] = this.name;
    }
    if (this.thumbnailAssetId != null) {
      json[r'thumbnailAssetId'] = this.thumbnailAssetId;
    }
    return json;
  }

  /// Returns a new [HighlightUpdateDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HighlightUpdateDto? fromJson(dynamic value) {
    upgradeDto(value, "HighlightUpdateDto");
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return HighlightUpdateDto(
        description: mapValueOfType<String>(json, r'description'),
        isPinned: mapValueOfType<bool>(json, r'isPinned'),
        name: mapValueOfType<String>(json, r'name'),
        thumbnailAssetId: mapValueOfType<String>(json, r'thumbnailAssetId'),
      );
    }
    return null;
  }

  static List<HighlightUpdateDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightUpdateDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightUpdateDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HighlightUpdateDto> mapFromJson(dynamic json) {
    final map = <String, HighlightUpdateDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HighlightUpdateDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HighlightUpdateDto-objects as value to a dart map
  static Map<String, List<HighlightUpdateDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HighlightUpdateDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HighlightUpdateDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{};
}

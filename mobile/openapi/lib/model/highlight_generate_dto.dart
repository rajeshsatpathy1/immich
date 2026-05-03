//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HighlightGenerateDto {
  /// Returns a new [HighlightGenerateDto] instance.
  HighlightGenerateDto({
    this.name,
    required this.sourceTagId,
  });

  /// Highlight name
  String? name;

  /// Source tag ID to generate highlight from
  String sourceTagId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HighlightGenerateDto &&
    other.name == name &&
    other.sourceTagId == sourceTagId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (sourceTagId.hashCode);

  @override
  String toString() => 'HighlightGenerateDto[name=$name, sourceTagId=$sourceTagId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    }
      json[r'sourceTagId'] = this.sourceTagId;
    return json;
  }

  /// Returns a new [HighlightGenerateDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HighlightGenerateDto? fromJson(dynamic value) {
    upgradeDto(value, "HighlightGenerateDto");
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return HighlightGenerateDto(
        name: mapValueOfType<String>(json, r'name'),
        sourceTagId: mapValueOfType<String>(json, r'sourceTagId')!,
      );
    }
    return null;
  }

  static List<HighlightGenerateDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightGenerateDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightGenerateDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HighlightGenerateDto> mapFromJson(dynamic json) {
    final map = <String, HighlightGenerateDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HighlightGenerateDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HighlightGenerateDto-objects as value to a dart map
  static Map<String, List<HighlightGenerateDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HighlightGenerateDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HighlightGenerateDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'sourceTagId',
  };
}

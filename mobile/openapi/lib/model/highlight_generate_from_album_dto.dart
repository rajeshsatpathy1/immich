//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HighlightGenerateFromAlbumDto {
  /// Returns a new [HighlightGenerateFromAlbumDto] instance.
  HighlightGenerateFromAlbumDto({
    required this.albumId,
    this.name,
  });

  /// Album ID to generate highlight from
  String albumId;

  /// Highlight name
  String? name;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HighlightGenerateFromAlbumDto &&
    other.albumId == albumId &&
    other.name == name;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (albumId.hashCode) +
    (name == null ? 0 : name!.hashCode);

  @override
  String toString() => 'HighlightGenerateFromAlbumDto[albumId=$albumId, name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'albumId'] = this.albumId;
    if (this.name != null) {
      json[r'name'] = this.name;
    }
    return json;
  }

  /// Returns a new [HighlightGenerateFromAlbumDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HighlightGenerateFromAlbumDto? fromJson(dynamic value) {
    upgradeDto(value, "HighlightGenerateFromAlbumDto");
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return HighlightGenerateFromAlbumDto(
        albumId: mapValueOfType<String>(json, r'albumId')!,
        name: mapValueOfType<String>(json, r'name'),
      );
    }
    return null;
  }

  static List<HighlightGenerateFromAlbumDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightGenerateFromAlbumDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightGenerateFromAlbumDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HighlightGenerateFromAlbumDto> mapFromJson(dynamic json) {
    final map = <String, HighlightGenerateFromAlbumDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HighlightGenerateFromAlbumDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HighlightGenerateFromAlbumDto-objects as value to a dart map
  static Map<String, List<HighlightGenerateFromAlbumDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HighlightGenerateFromAlbumDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HighlightGenerateFromAlbumDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'albumId',
  };
}

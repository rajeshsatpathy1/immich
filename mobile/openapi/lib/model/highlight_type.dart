//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class HighlightType {
  /// Instantiate a new enum with the provided [value].
  const HighlightType._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const manual = HighlightType._(r'manual');
  static const auto = HighlightType._(r'auto');

  /// List of all possible values in this [enum][HighlightType].
  static const values = <HighlightType>[
    manual,
    auto,
  ];

  static HighlightType? fromJson(dynamic value) => HighlightTypeTypeTransformer().decode(value);

  static List<HighlightType> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HighlightType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HighlightType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [HighlightType] to String,
/// and [decode] dynamic data back to [HighlightType].
class HighlightTypeTypeTransformer {
  factory HighlightTypeTypeTransformer() => _instance ??= const HighlightTypeTypeTransformer._();

  const HighlightTypeTypeTransformer._();

  String encode(HighlightType data) => data.value;

  /// Decodes a [dynamic value][data] to a HighlightType.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  HighlightType? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'manual': return HighlightType.manual;
        case r'auto': return HighlightType.auto;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [HighlightTypeTypeTransformer] instance.
  static HighlightTypeTypeTransformer? _instance;
}

import 'package:flutter_test/flutter_test.dart';
import 'package:immich_mobile/domain/models/user.model.dart';

void main() {
  group('UserDto', () {
    test('copyWith can override highlightsEnabled', () {
      final user = _createUser(highlightsEnabled: true);

      final copy = user.copyWith(highlightsEnabled: false);

      expect(copy.highlightsEnabled, isFalse);
      expect(copy.memoryEnabled, user.memoryEnabled);
      expect(copy.id, user.id);
    });

    test('equality and hashCode include highlightsEnabled', () {
      final enabled = _createUser(highlightsEnabled: true);
      final disabled = _createUser(highlightsEnabled: false);

      expect(enabled == disabled, isFalse);
      expect(enabled.hashCode == disabled.hashCode, isFalse);
    });
  });
}

UserDto _createUser({bool memoryEnabled = true, bool highlightsEnabled = true}) {
  return UserDto(
    id: 'user-1',
    email: 'user@example.com',
    name: 'User',
    updatedAt: DateTime(2024, 1, 2),
    profileChangedAt: DateTime(2024, 1, 1),
    avatarColor: AvatarColor.blue,
    memoryEnabled: memoryEnabled,
    highlightsEnabled: highlightsEnabled,
    inTimeline: false,
    isPartnerSharedBy: false,
    isPartnerSharedWith: false,
    hasProfileImage: true,
    quotaSizeInBytes: 100,
    quotaUsageInBytes: 50,
  );
}

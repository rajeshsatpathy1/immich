import 'package:flutter_test/flutter_test.dart';
import 'package:immich_mobile/infrastructure/utils/user.converter.dart';
import 'package:openapi/api.dart';

void main() {
  group('UserConverter.fromAdminDto', () {
    test('defaults memories and highlights to enabled when preferences are absent', () {
      final dto = _createAdminDto();

      final user = UserConverter.fromAdminDto(dto);

      expect(user.memoryEnabled, isTrue);
      expect(user.highlightsEnabled, isTrue);
    });

    test('maps memory and highlight preferences from the response dto', () {
      final dto = _createAdminDto();
      final preferences = _createPreferences(memoriesEnabled: false, highlightsEnabled: false);

      final user = UserConverter.fromAdminDto(dto, preferences);

      expect(user.memoryEnabled, isFalse);
      expect(user.highlightsEnabled, isFalse);
    });
  });

  group('UserPreferencesResponseDto.fromJson', () {
    test('defaults highlights to enabled when the field is missing', () {
      final json = <String, dynamic>{
        'albums': {'defaultAssetOrder': 'desc'},
        'cast': {'gCastEnabled': false},
        'download': {'archiveSize': 1024, 'includeEmbeddedVideos': false},
        'emailNotifications': {'albumInvite': true, 'albumUpdate': true, 'enabled': true},
        'folders': {'enabled': false, 'sidebarWeb': false},
        'memories': {'duration': 5, 'enabled': true},
        'people': {'enabled': true, 'sidebarWeb': false},
        'purchase': {'hideBuyButtonUntil': '', 'showSupportBadge': false},
        'ratings': {'enabled': false},
        'sharedLinks': {'enabled': true, 'sidebarWeb': false},
        'tags': {'enabled': true, 'sidebarWeb': true},
      };

      final preferences = UserPreferencesResponseDto.fromJson(json);

      expect(preferences, isNotNull);
      expect(preferences!.highlights.enabled, isTrue);
      expect(preferences.memories.enabled, isTrue);
    });
  });
}

UserAdminResponseDto _createAdminDto() {
  return UserAdminResponseDto(
    avatarColor: UserAvatarColor.blue,
    createdAt: DateTime(2024, 1, 1),
    deletedAt: null,
    email: 'admin@example.com',
    id: 'admin-1',
    isAdmin: true,
    license: null,
    name: 'Admin User',
    oauthId: '',
    profileChangedAt: DateTime(2024, 1, 2),
    profileImagePath: '/profile.jpg',
    quotaSizeInBytes: 1000,
    quotaUsageInBytes: 250,
    shouldChangePassword: false,
    status: UserStatus.active,
    storageLabel: null,
    updatedAt: DateTime(2024, 1, 3),
  );
}

UserPreferencesResponseDto _createPreferences({required bool memoriesEnabled, required bool highlightsEnabled}) {
  return UserPreferencesResponseDto(
    albums: AlbumsResponse(defaultAssetOrder: AssetOrder.desc),
    cast: CastResponse(gCastEnabled: false),
    download: DownloadResponse(archiveSize: 1024, includeEmbeddedVideos: false),
    emailNotifications: EmailNotificationsResponse(albumInvite: true, albumUpdate: true, enabled: true),
    folders: FoldersResponse(enabled: false, sidebarWeb: false),
    highlights: HighlightsResponse(enabled: highlightsEnabled),
    memories: MemoriesResponse(duration: 5, enabled: memoriesEnabled),
    people: PeopleResponse(enabled: true, sidebarWeb: false),
    purchase: PurchaseResponse(hideBuyButtonUntil: '', showSupportBadge: false),
    ratings: RatingsResponse(enabled: false),
    sharedLinks: SharedLinksResponse(enabled: true, sidebarWeb: false),
    tags: TagsResponse(enabled: true, sidebarWeb: true),
  );
}

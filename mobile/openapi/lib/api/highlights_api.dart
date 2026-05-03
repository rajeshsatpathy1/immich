//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class HighlightsApi {
  HighlightsApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Add assets to a highlight
  ///
  /// Add a list of asset IDs to a specific highlight.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [BulkIdsDto] bulkIdsDto (required):
  Future<Response> addHighlightAssetsWithHttpInfo(String id, BulkIdsDto bulkIdsDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/{id}/assets'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = bulkIdsDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Add assets to a highlight
  ///
  /// Add a list of asset IDs to a specific highlight.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [BulkIdsDto] bulkIdsDto (required):
  Future<List<BulkIdResponseDto>?> addHighlightAssets(String id, BulkIdsDto bulkIdsDto,) async {
    final response = await addHighlightAssetsWithHttpInfo(id, bulkIdsDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<BulkIdResponseDto>') as List)
        .cast<BulkIdResponseDto>()
        .toList(growable: false);
    }
    return null;
  }

  /// Create a highlight
  ///
  /// Create a new highlight, either manual or auto-curated from a tag.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [HighlightCreateDto] highlightCreateDto (required):
  Future<Response> createHighlightWithHttpInfo(HighlightCreateDto highlightCreateDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights';

    // ignore: prefer_final_locals
    Object? postBody = highlightCreateDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Create a highlight
  ///
  /// Create a new highlight, either manual or auto-curated from a tag.
  ///
  /// Parameters:
  ///
  /// * [HighlightCreateDto] highlightCreateDto (required):
  Future<HighlightResponseDto?> createHighlight(HighlightCreateDto highlightCreateDto,) async {
    final response = await createHighlightWithHttpInfo(highlightCreateDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'HighlightResponseDto',) as HighlightResponseDto;
    }
    return null;
  }

  /// Delete a highlight
  ///
  /// Delete a specific highlight by its ID.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> deleteHighlightWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      apiPath,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Delete a highlight
  ///
  /// Delete a specific highlight by its ID.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<void> deleteHighlight(String id,) async {
    final response = await deleteHighlightWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Generate highlight from tag
  ///
  /// Generate or regenerate an auto-curated highlight from a source tag.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [HighlightGenerateDto] highlightGenerateDto (required):
  Future<Response> generateHighlightWithHttpInfo(HighlightGenerateDto highlightGenerateDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/generate';

    // ignore: prefer_final_locals
    Object? postBody = highlightGenerateDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Generate highlight from tag
  ///
  /// Generate or regenerate an auto-curated highlight from a source tag.
  ///
  /// Parameters:
  ///
  /// * [HighlightGenerateDto] highlightGenerateDto (required):
  Future<HighlightResponseDto?> generateHighlight(HighlightGenerateDto highlightGenerateDto,) async {
    final response = await generateHighlightWithHttpInfo(highlightGenerateDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'HighlightResponseDto',) as HighlightResponseDto;
    }
    return null;
  }

  /// Generate highlight from album
  ///
  /// Generate a manual highlight by scoring and selecting the best photos from an album.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [HighlightGenerateFromAlbumDto] highlightGenerateFromAlbumDto (required):
  Future<Response> generateHighlightFromAlbumWithHttpInfo(HighlightGenerateFromAlbumDto highlightGenerateFromAlbumDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/from-album';

    // ignore: prefer_final_locals
    Object? postBody = highlightGenerateFromAlbumDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Generate highlight from album
  ///
  /// Generate a manual highlight by scoring and selecting the best photos from an album.
  ///
  /// Parameters:
  ///
  /// * [HighlightGenerateFromAlbumDto] highlightGenerateFromAlbumDto (required):
  Future<HighlightResponseDto?> generateHighlightFromAlbum(HighlightGenerateFromAlbumDto highlightGenerateFromAlbumDto,) async {
    final response = await generateHighlightFromAlbumWithHttpInfo(highlightGenerateFromAlbumDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'HighlightResponseDto',) as HighlightResponseDto;
    }
    return null;
  }

  /// Retrieve a highlight
  ///
  /// Retrieve a specific highlight by its ID.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> getHighlightWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      apiPath,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Retrieve a highlight
  ///
  /// Retrieve a specific highlight by its ID.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<HighlightResponseDto?> getHighlight(String id,) async {
    final response = await getHighlightWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'HighlightResponseDto',) as HighlightResponseDto;
    }
    return null;
  }

  /// Remove assets from a highlight
  ///
  /// Remove a list of asset IDs from a specific highlight.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [BulkIdsDto] bulkIdsDto (required):
  Future<Response> removeHighlightAssetsWithHttpInfo(String id, BulkIdsDto bulkIdsDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/{id}/assets'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = bulkIdsDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Remove assets from a highlight
  ///
  /// Remove a list of asset IDs from a specific highlight.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [BulkIdsDto] bulkIdsDto (required):
  Future<List<BulkIdResponseDto>?> removeHighlightAssets(String id, BulkIdsDto bulkIdsDto,) async {
    final response = await removeHighlightAssetsWithHttpInfo(id, bulkIdsDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<BulkIdResponseDto>') as List)
        .cast<BulkIdResponseDto>()
        .toList(growable: false);
    }
    return null;
  }

  /// Retrieve highlights
  ///
  /// Retrieve a list of highlights for the authenticated user.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [bool] isPinned:
  ///   Filter by pinned status
  ///
  /// * [int] size:
  ///   Number of highlights to return
  ///
  /// * [HighlightType] type:
  ///   Highlight type
  Future<Response> searchHighlightsWithHttpInfo({ bool? isPinned, int? size, HighlightType? type, }) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (isPinned != null) {
      queryParams.addAll(_queryParams('', 'isPinned', isPinned));
    }
    if (size != null) {
      queryParams.addAll(_queryParams('', 'size', size));
    }
    if (type != null) {
      queryParams.addAll(_queryParams('', 'type', type));
    }

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      apiPath,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Retrieve highlights
  ///
  /// Retrieve a list of highlights for the authenticated user.
  ///
  /// Parameters:
  ///
  /// * [bool] isPinned:
  ///   Filter by pinned status
  ///
  /// * [int] size:
  ///   Number of highlights to return
  ///
  /// * [HighlightType] type:
  ///   Highlight type
  Future<List<HighlightResponseDto>?> searchHighlights({ bool? isPinned, int? size, HighlightType? type, }) async {
    final response = await searchHighlightsWithHttpInfo( isPinned: isPinned, size: size, type: type, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<HighlightResponseDto>') as List)
        .cast<HighlightResponseDto>()
        .toList(growable: false);
    }
    return null;
  }

  /// Update a highlight
  ///
  /// Update an existing highlight by its ID.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [HighlightUpdateDto] highlightUpdateDto (required):
  Future<Response> updateHighlightWithHttpInfo(String id, HighlightUpdateDto highlightUpdateDto,) async {
    // ignore: prefer_const_declarations
    final apiPath = r'/highlights/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = highlightUpdateDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      apiPath,
      'PUT',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update a highlight
  ///
  /// Update an existing highlight by its ID.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [HighlightUpdateDto] highlightUpdateDto (required):
  Future<HighlightResponseDto?> updateHighlight(String id, HighlightUpdateDto highlightUpdateDto,) async {
    final response = await updateHighlightWithHttpInfo(id, highlightUpdateDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'HighlightResponseDto',) as HighlightResponseDto;
    }
    return null;
  }
}

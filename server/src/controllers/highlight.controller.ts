import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Endpoint, HistoryBuilder } from 'src/decorators';
import { BulkIdResponseDto, BulkIdsDto } from 'src/dtos/asset-ids.response.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import {
  HighlightCreateDto,
  HighlightGenerateDto,
  HighlightGenerateFromAlbumDto,
  HighlightResponseDto,
  HighlightSearchDto,
  HighlightUpdateDto,
} from 'src/dtos/highlight.dto';
import { ApiTag, Permission } from 'src/enum';
import { Auth, Authenticated } from 'src/middleware/auth.guard';
import { HighlightService } from 'src/services/highlight.service';
import { UUIDParamDto } from 'src/validation';

@ApiTags(ApiTag.Highlights)
@Controller('highlights')
export class HighlightController {
  constructor(private service: HighlightService) {}

  @Get()
  @Authenticated({ permission: Permission.HighlightRead })
  @Endpoint({
    summary: 'Retrieve highlights',
    description: 'Retrieve a list of highlights for the authenticated user.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  searchHighlights(@Auth() auth: AuthDto, @Query() dto: HighlightSearchDto): Promise<HighlightResponseDto[]> {
    return this.service.search(auth, dto);
  }

  @Post()
  @Authenticated({ permission: Permission.HighlightCreate })
  @Endpoint({
    summary: 'Create a highlight',
    description: 'Create a new highlight, either manual or auto-curated from a tag.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  createHighlight(@Auth() auth: AuthDto, @Body() dto: HighlightCreateDto): Promise<HighlightResponseDto> {
    return this.service.create(auth, dto);
  }

  @Post('generate')
  @Authenticated({ permission: Permission.HighlightCreate })
  @Endpoint({
    summary: 'Generate highlight from tag',
    description: 'Generate or regenerate an auto-curated highlight from a source tag.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  generateHighlight(@Auth() auth: AuthDto, @Body() dto: HighlightGenerateDto): Promise<HighlightResponseDto> {
    return this.service.generate(auth, dto);
  }

  @Post('from-album')
  @Authenticated({ permission: Permission.HighlightCreate })
  @Endpoint({
    summary: 'Generate highlight from album',
    description: 'Generate a manual highlight by scoring and selecting the best photos from an album.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  generateHighlightFromAlbum(
    @Auth() auth: AuthDto,
    @Body() dto: HighlightGenerateFromAlbumDto,
  ): Promise<HighlightResponseDto> {
    return this.service.generateFromAlbum(auth, dto);
  }

  @Get(':id')
  @Authenticated({ permission: Permission.HighlightRead })
  @Endpoint({
    summary: 'Retrieve a highlight',
    description: 'Retrieve a specific highlight by its ID.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  getHighlight(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<HighlightResponseDto> {
    return this.service.get(auth, id);
  }

  @Put(':id')
  @Authenticated({ permission: Permission.HighlightUpdate })
  @Endpoint({
    summary: 'Update a highlight',
    description: 'Update an existing highlight by its ID.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  updateHighlight(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: HighlightUpdateDto,
  ): Promise<HighlightResponseDto> {
    return this.service.update(auth, id, dto);
  }

  @Delete(':id')
  @Authenticated({ permission: Permission.HighlightDelete })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Endpoint({
    summary: 'Delete a highlight',
    description: 'Delete a specific highlight by its ID.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  deleteHighlight(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<void> {
    return this.service.remove(auth, id);
  }

  @Post(':id/assets')
  @Authenticated({ permission: Permission.HighlightAssetCreate })
  @Endpoint({
    summary: 'Add assets to a highlight',
    description: 'Add a list of asset IDs to a specific highlight.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  addHighlightAssets(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: BulkIdsDto,
  ): Promise<BulkIdResponseDto[]> {
    return this.service.addAssets(auth, id, dto);
  }

  @Delete(':id/assets')
  @Authenticated({ permission: Permission.HighlightAssetDelete })
  @HttpCode(HttpStatus.OK)
  @Endpoint({
    summary: 'Remove assets from a highlight',
    description: 'Remove a list of asset IDs from a specific highlight.',
    history: new HistoryBuilder().added('v2.6.0').beta('v2.6.0'),
  })
  removeHighlightAssets(
    @Auth() auth: AuthDto,
    @Body() dto: BulkIdsDto,
    @Param() { id }: UUIDParamDto,
  ): Promise<BulkIdResponseDto[]> {
    return this.service.removeAssets(auth, id, dto);
  }
}

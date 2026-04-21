// Highlights feature — system-config DTO classes.
// Kept here so that system-config.dto.ts only needs a single import line,
// minimising the rebase-conflict surface on that file.

import { ValidateBoolean } from 'src/validation';

export class SystemConfigMemoriesDto {
  @ValidateBoolean({ description: 'Enabled' })
  enabled!: boolean;
}

export class SystemConfigHighlightsDto {
  @ValidateBoolean({ description: 'Enabled' })
  enabled!: boolean;
}

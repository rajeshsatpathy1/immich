import {
  AfterDeleteTrigger,
  Column,
  CreateDateColumn,
  ForeignKeyColumn,
  Generated,
  Table,
  Timestamp,
  UpdateDateColumn,
} from '@immich/sql-tools';
import { UpdatedAtTrigger, UpdateIdColumn } from 'src/decorators';
import { highlight_asset_delete_audit } from 'src/schema/functions';
import { AssetTable } from 'src/schema/tables/asset.table';
import { HighlightTable } from 'src/schema/tables/highlight.table';

@Table('highlight_asset')
@UpdatedAtTrigger('highlight_asset_updatedAt')
@AfterDeleteTrigger({
  scope: 'statement',
  function: highlight_asset_delete_audit,
  referencingOldTableAs: 'old',
  when: 'pg_trigger_depth() <= 1',
})
export class HighlightAssetTable {
  @ForeignKeyColumn(() => HighlightTable, { onUpdate: 'CASCADE', onDelete: 'CASCADE', primary: true })
  highlightId!: string;

  @ForeignKeyColumn(() => AssetTable, { onUpdate: 'CASCADE', onDelete: 'CASCADE', primary: true })
  assetId!: string;

  @Column({ type: 'integer', default: 0 })
  position!: Generated<number>;

  @Column({ type: 'real', nullable: true })
  score!: number | null;

  @CreateDateColumn()
  createdAt!: Generated<Timestamp>;

  @UpdateDateColumn()
  updatedAt!: Generated<Timestamp>;

  @UpdateIdColumn({ index: true })
  updateId!: Generated<string>;
}

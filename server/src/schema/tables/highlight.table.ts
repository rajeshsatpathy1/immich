import {
  AfterDeleteTrigger,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ForeignKeyColumn,
  Generated,
  PrimaryGeneratedColumn,
  Table,
  Timestamp,
  UpdateDateColumn,
} from '@immich/sql-tools';
import { UpdatedAtTrigger, UpdateIdColumn } from 'src/decorators';
import { HighlightType } from 'src/enum';
import { highlight_delete_audit } from 'src/schema/functions';
import { AssetTable } from 'src/schema/tables/asset.table';
import { TagTable } from 'src/schema/tables/tag.table';
import { UserTable } from 'src/schema/tables/user.table';

@Table('highlight')
@UpdatedAtTrigger('highlight_updatedAt')
@AfterDeleteTrigger({
  scope: 'statement',
  function: highlight_delete_audit,
  referencingOldTableAs: 'old',
  when: 'pg_trigger_depth() = 0',
})
export class HighlightTable {
  @PrimaryGeneratedColumn()
  id!: Generated<string>;

  @CreateDateColumn()
  createdAt!: Generated<Timestamp>;

  @UpdateDateColumn()
  updatedAt!: Generated<Timestamp>;

  @DeleteDateColumn()
  deletedAt!: Timestamp | null;

  @ForeignKeyColumn(() => UserTable, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  ownerId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', default: '' })
  description!: Generated<string>;

  @Column()
  type!: HighlightType;

  @Column({ type: 'boolean', default: false })
  isPinned!: Generated<boolean>;

  @ForeignKeyColumn(() => TagTable, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  sourceTagId!: string | null;

  @ForeignKeyColumn(() => AssetTable, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  thumbnailAssetId!: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  scoringConfig!: Generated<object>;

  @UpdateIdColumn({ index: true })
  updateId!: Generated<string>;
}

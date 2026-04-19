import { Injectable } from '@nestjs/common';
import { JOBS_ASSET_PAGINATION_SIZE } from 'src/constants';
import { OnJob } from 'src/decorators';
import { AssetVisibility, JobName, JobStatus, QueueName } from 'src/enum';
import { BaseService } from 'src/services/base.service';
import { JobItem, JobOf } from 'src/types';

@Injectable()
export class AestheticScoreService extends BaseService {
  @OnJob({ name: JobName.AestheticScoreQueueAll, queue: QueueName.AestheticScore })
  async handleQueueAestheticScore({ force }: JobOf<JobName.AestheticScoreQueueAll>): Promise<JobStatus> {
    const { machineLearning } = await this.getConfig({ withCache: false });
    if (!machineLearning.aesthetic.enabled) {
      return JobStatus.Skipped;
    }

    let queue: JobItem[] = [];
    const assets = this.assetJobRepository.streamForAestheticScore(force);
    for await (const asset of assets) {
      queue.push({ name: JobName.AestheticScore, data: { id: asset.id } });
      if (queue.length >= JOBS_ASSET_PAGINATION_SIZE) {
        await this.jobRepository.queueAll(queue);
        queue = [];
      }
    }

    await this.jobRepository.queueAll(queue);
    return JobStatus.Success;
  }

  @OnJob({ name: JobName.AestheticScore, queue: QueueName.AestheticScore })
  async handleAestheticScore({ id }: JobOf<JobName.AestheticScore>): Promise<JobStatus> {
    const { machineLearning } = await this.getConfig({ withCache: true });
    if (!machineLearning.aesthetic.enabled) {
      return JobStatus.Skipped;
    }

    const asset = await this.assetJobRepository.getForAestheticScore(id);
    if (!asset || asset.files.length !== 1) {
      return JobStatus.Failed;
    }

    if (asset.visibility === AssetVisibility.Hidden) {
      return JobStatus.Skipped;
    }

    const score = await this.machineLearningRepository.scoreAesthetic(asset.files[0].path, machineLearning.aesthetic);

    await this.assetRepository.upsertAestheticScore(id, score);
    await this.assetRepository.upsertJobStatus({ assetId: id, aestheticScoredAt: new Date() });

    return JobStatus.Success;
  }
}

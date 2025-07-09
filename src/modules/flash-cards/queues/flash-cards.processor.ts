import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor('image-optimize', {
  concurrency: 1,
  limiter: {
    max: 200,
    duration: 60000,
  },
})
export class ImageOptimizationProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageOptimizationProcessor.name);

  constructor(
    @InjectQueue('image-optimize') private readonly imageOptimizeQueue: Queue,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case 'optimize-size':
        const optimizedImage = await this.optimizeImage(job.data);
        // console.log({ optimizedImage });
        return optimizedImage;
      default:
        throw new Error('No job name matched');
    }
  }

  async optimizeImage(image: unknown) {
    this.logger.log('Processing image ...');
    return await new Promise((resolve) =>
      setTimeout(() => resolve(image), 30000),
    );
  }

  async uploadImageToCloud(image: any) {
    this.logger.log('Uploading image to cloud ...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const imageUrl = `https://my-cloud-storage.com/images/${image.flashCardId}.jpg`;
    // Update image URL in the database
    // await this.flashCardRepository.update(image.flashCardId, { image: imageUrl });
    return { newImageUrl: imageUrl };
  }

  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job completed: ${job.id}`);

    if (job.name === 'optimize-size') {
      this.imageOptimizeQueue.add('upload-image', { image: result });
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job failed: ${job.id}`, error);
  }
}

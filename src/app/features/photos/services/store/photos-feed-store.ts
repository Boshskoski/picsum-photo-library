import { Service, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { PhotosFeedUtilService } from '../util/photos-feed-util';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';

@Service()
export class PhotosFeedStore {
  private readonly feedUtil = inject(PhotosFeedUtilService);

  private readonly state = signal<Photo[]>([]);
  private readonly loadingState = signal(false);

  readonly photos = this.state.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  loadMore(): void {
    if (this.loadingState()) {
      return;
    }
    this.loadingState.set(true);

    this.feedUtil
      .loadNextBatch(PHOTOS_FEED_CONFIG.batchSize)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: (batch) => this.state.update((photos) => [...photos, ...batch]),
      });
  }
}

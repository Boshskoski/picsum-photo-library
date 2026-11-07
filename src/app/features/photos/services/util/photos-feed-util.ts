import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { Service } from '@angular/core';

@Service()
export class PhotosFeedUtilService {
  loadNextBatch(size: number): Observable<Photo[]> {
    const batch: Photo[] = Array.from({ length: size }, () => ({ id: crypto.randomUUID() }));

    return of(batch).pipe(delay(this.randomDelay()));
  }

  private randomDelay(): number {
    const { minDelayMs, maxDelayMs } = PHOTOS_FEED_CONFIG;
    return minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
  }
}

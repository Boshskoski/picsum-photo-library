import { TestBed } from '@angular/core/testing';
import { PhotosFeedUtilService } from './photos-feed-util';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { Photo } from '../../../../core/models/ui/photo.ui';

describe('PhotosFeedUtilService', () => {
  let service: PhotosFeedUtilService;
  let batch: Photo[] | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(PhotosFeedUtilService);
    batch = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function requestBatch(size: number): void {
    service.loadNextBatch(size).subscribe((photos) => (batch = photos));
  }

  async function waitMs(ms: number): Promise<void> {
    await vi.advanceTimersByTimeAsync(ms);
  }

  it('returns as many photos as requested', async () => {
    requestBatch(5);
    await waitMs(PHOTOS_FEED_CONFIG.maxDelayMs);

    expect(batch).toHaveLength(5);
  });

  it('gives every photo a unique id', async () => {
    requestBatch(10);
    await waitMs(PHOTOS_FEED_CONFIG.maxDelayMs);

    const ids = batch!.map((photo) => photo.id);
    expect(new Set(ids).size).toBe(10);
  });

  it('returns an empty list when the size is 0', async () => {
    requestBatch(0);
    await waitMs(PHOTOS_FEED_CONFIG.maxDelayMs);

    expect(batch).toEqual([]);
  });

  it('does not return the batch right away', () => {
    requestBatch(3);

    expect(batch).toBeUndefined();
  });

  it('does not return the batch before the minimum delay', async () => {
    requestBatch(3);
    await waitMs(PHOTOS_FEED_CONFIG.minDelayMs - 1);

    expect(batch).toBeUndefined();
  });
});

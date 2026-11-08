import { TestBed } from '@angular/core/testing';
import { PhotosFeedStore } from './photos-feed-store';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';

describe('PhotosFeedStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function batchArrives(): Promise<void> {
    await vi.advanceTimersByTimeAsync(PHOTOS_FEED_CONFIG.maxDelayMs);
  }

  it('starts empty and not loading', () => {
    const store = TestBed.inject(PhotosFeedStore);

    expect(store.photos()).toEqual([]);
    expect(store.loading()).toBe(false);
  });

  it('is loading while a batch is on its way', () => {
    const store = TestBed.inject(PhotosFeedStore);

    store.loadMore();

    expect(store.loading()).toBe(true);
  });

  it('adds a batch of photos and stops loading once it arrives', async () => {
    const store = TestBed.inject(PhotosFeedStore);

    store.loadMore();
    await batchArrives();

    expect(store.photos()).toHaveLength(PHOTOS_FEED_CONFIG.batchSize);
    expect(store.loading()).toBe(false);
  });

  it('appends the next batch after the existing photos', async () => {
    const store = TestBed.inject(PhotosFeedStore);
    store.loadMore();
    await batchArrives();
    const firstBatch = store.photos();

    store.loadMore();
    await batchArrives();

    expect(store.photos()).toHaveLength(PHOTOS_FEED_CONFIG.batchSize * 2);
    expect(store.photos().slice(0, PHOTOS_FEED_CONFIG.batchSize)).toEqual(firstBatch);
  });

  it('ignores loadMore while a batch is still loading', async () => {
    const store = TestBed.inject(PhotosFeedStore);

    store.loadMore();
    store.loadMore();
    await batchArrives();

    expect(store.photos()).toHaveLength(PHOTOS_FEED_CONFIG.batchSize);
  });
});

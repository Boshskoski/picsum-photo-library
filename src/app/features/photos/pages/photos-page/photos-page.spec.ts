import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { PhotosPage } from './photos-page';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { PhotosFeedUtilService } from '../../services/util/photos-feed-util';
import { FavoritesStore } from '../../../favorites/services/store/favorites-store';

describe('PhotosPage', () => {
  class FakeIntersectionObserver {
    constructor(private readonly callback: (changes: { isIntersecting: boolean }[]) => void) {}

    observe(): void {
      this.callback([{ isIntersecting: true }]);
    }

    unobserve(): void {}
    disconnect(): void {}
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function setup() {
    const fixture = TestBed.createComponent(PhotosPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tiles = () => Array.from(element.querySelectorAll('app-photo-tile'));
    const loader = () => element.querySelector('app-loader');
    const clickTile = (index: number) => tiles()[index].querySelector('button')!.click();
    const isMarkedAsFavorite = (index: number) => tiles()[index].querySelector('mat-icon') !== null;

    async function batchArrives(): Promise<void> {
      await vi.advanceTimersByTimeAsync(PHOTOS_FEED_CONFIG.maxDelayMs);
      fixture.detectChanges();
    }

    return { fixture, tiles, loader, clickTile, isMarkedAsFavorite, batchArrives };
  }

  it('shows the loader while the first batch is on its way', () => {
    const feedUtil = TestBed.inject(PhotosFeedUtilService);
    vi.spyOn(feedUtil, 'loadNextBatch').mockReturnValue(NEVER);

    const { loader, tiles } = setup();

    expect(loader()).not.toBeNull();
    expect(tiles()).toHaveLength(0);
  });

  it('shows the first batch once the emulated API answers', async () => {
    const { tiles, batchArrives } = setup();
    expect(tiles()).toHaveLength(0);

    await batchArrives();

    expect(tiles()).toHaveLength(PHOTOS_FEED_CONFIG.batchSize);
  });

  it('adds a clicked photo to favorites', async () => {
    const { clickTile, batchArrives } = setup();
    await batchArrives();

    clickTile(0);

    expect(TestBed.inject(FavoritesStore).favorites()).toHaveLength(1);
  });

  it('marks the tile of a photo that was added to favorites', async () => {
    const { fixture, clickTile, isMarkedAsFavorite, batchArrives } = setup();
    await batchArrives();
    expect(isMarkedAsFavorite(0)).toBe(false);

    clickTile(0);
    fixture.detectChanges();

    expect(isMarkedAsFavorite(0)).toBe(true);
  });
});
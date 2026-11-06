import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { PhotosPage } from './photos-page';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { PhotosFeedUtilService } from '../../services/util/photos-feed-util';

describe('PhotosPage', () => {
  let fixture: ComponentFixture<PhotosPage>;
  let element: HTMLElement;

  function open(): void {
    fixture = TestBed.createComponent(PhotosPage);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  async function batchArrives(): Promise<void> {
    await vi.advanceTimersByTimeAsync(PHOTOS_FEED_CONFIG.maxDelayMs);
    fixture.detectChanges();
  }

  const tiles = () => element.querySelectorAll('app-photo-tile');
  const loader = () => element.querySelector('app-loader');

  it('shows the loader while the first batch is on its way', () => {
    const feedUtil = TestBed.inject(PhotosFeedUtilService);
    vi.spyOn(feedUtil, 'loadNextBatch').mockReturnValue(NEVER);

    open();

    expect(loader()).not.toBeNull();
    expect(tiles()).toHaveLength(0);
  });

  it('shows the first batch once the emulated API answers', async () => {
    vi.useFakeTimers();
    open();
    expect(tiles()).toHaveLength(0);

    await batchArrives();

    expect(tiles()).toHaveLength(PHOTOS_FEED_CONFIG.batchSize);
  });
});
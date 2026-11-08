import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  inject,
  viewChild,
} from '@angular/core';
import { PhotoGrid } from '../../../../shared/components/photo-grid/photo-grid';
import { PhotosFeedStore } from '../../services/store/photos-feed-store';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { Loader } from '../../../../shared/components/loader/loader';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { FavoritesStore } from '../../../favorites/services/store/favorites-store';

@Component({
  selector: 'app-photos-page',
  imports: [Loader, PhotoGrid],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage {
  private readonly photosFeedStore = inject(PhotosFeedStore);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly loadMoreTrigger = viewChild.required<ElementRef<HTMLElement>>('loadMoreTrigger');

  readonly photos = this.photosFeedStore.photos;
  readonly loading = this.photosFeedStore.loading;

  readonly favoriteIds = this.favoritesStore.favoriteIdSet;

  constructor() {
    const observer = new IntersectionObserver(
      (changes) => {
        const isTriggerVisible = changes.some((change) => change.isIntersecting);
        if (isTriggerVisible) {
          this.photosFeedStore.loadMore();
        }
      },
      { rootMargin: `${PHOTOS_FEED_CONFIG.preloadMarginPx}px` },
    );
    inject(DestroyRef).onDestroy(() => observer.disconnect());

    afterRenderEffect(() => {
      this.photos();
      const trigger = this.loadMoreTrigger().nativeElement;
      observer.unobserve(trigger);
      observer.observe(trigger);
    });
  }

  addToFavorites(photo: Photo): void {
    this.favoritesStore.add(photo);
  }
}

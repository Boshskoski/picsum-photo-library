import { Component, afterRenderEffect, inject } from '@angular/core';
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
  host: { '(window:scroll)': 'loadMoreIfNearBottom()' },
})
export class PhotosPage {
  private readonly photosFeedStore = inject(PhotosFeedStore);
  private readonly favoritesStore = inject(FavoritesStore);

  readonly photos = this.photosFeedStore.photos;
  readonly loading = this.photosFeedStore.loading;

  readonly isFavorite = (id: string): boolean => this.favoritesStore.isFavorite(id);

  constructor() {
    afterRenderEffect(() => this.loadMoreIfNearBottom());
  }

  addToFavorites(photo: Photo): void {
    this.favoritesStore.add(photo);
  }

  loadMoreIfNearBottom(): void {
    if (this.loading()) {
      return;
    }
    const scrolledTo = window.scrollY + window.innerHeight;
    const loadFrom = document.documentElement.scrollHeight - PHOTOS_FEED_CONFIG.preloadMarginPx;
    if (scrolledTo >= loadFrom) {
      this.photosFeedStore.loadMore();
    }
  }
}

import { Component, afterRenderEffect, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PhotoGrid } from '../../../../shared/components/photo-grid/photo-grid';
import { PhotosFeedStore } from '../../services/store/photos-feed-store';
import { PHOTOS_FEED_CONFIG } from '../../constants/photos-feed.constant';
import { Loader } from '../../../../shared/components/loader/loader';

@Component({
  selector: 'app-photos-page',
  imports: [Loader, MatButton, PhotoGrid],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
  host: { '(window:scroll)': 'loadMoreIfNearBottom()' },
})
export class PhotosPage {
  private readonly photosFeedStore = inject(PhotosFeedStore);

  readonly photos = this.photosFeedStore.photos;
  readonly loading = this.photosFeedStore.loading;

  constructor() {
    afterRenderEffect(() => this.loadMoreIfNearBottom());
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

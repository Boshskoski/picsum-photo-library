import { Component, computed, inject, input } from '@angular/core';
import { FavoritesStore } from '../../../favorites/services/store/favorites-store';
import { Router } from '@angular/router';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { AppPath } from '../../../../core/constants/app-path.constants';
import { MatButton } from '@angular/material/button';
import { PhotoViewer } from '../../components/photo-viewer/photo-viewer';

@Component({
  imports: [MatButton, PhotoViewer],
  selector: 'app-photo-details-page',
  styleUrl: './photo-details-page.scss',
  templateUrl: './photo-details-page.html',
})
export class PhotoDetailsPage {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.favoritesStore.find(this.id()) ?? null);

  async removeFromFavorites(photo: Photo): Promise<void> {
    const navigated = await this.router.navigate(['/', AppPath.Favorites]);
    if (navigated) {
      this.favoritesStore.remove(photo.id);
    }
  }
}

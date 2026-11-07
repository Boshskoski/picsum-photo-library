import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../../services/store/favorites-store';
import { PhotoGrid } from '../../../../shared/components/photo-grid/photo-grid';

@Component({
  imports: [PhotoGrid],
  selector: 'app-favorites-page',
  styleUrl: './favorites-page.scss',
  templateUrl: './favorites-page.html',
})
export class FavoritesPage {
  private readonly favoritesStore = inject(FavoritesStore);

  readonly favorites = this.favoritesStore.favorites;
}

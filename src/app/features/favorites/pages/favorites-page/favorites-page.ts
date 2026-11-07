import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../../services/store/favorites-store';
import { PhotoGrid } from '../../../../shared/components/photo-grid/photo-grid';
import { AppPath } from '../../../../core/constants/app-path.constants';
import { Router } from '@angular/router';

@Component({
  imports: [PhotoGrid],
  selector: 'app-favorites-page',
  styleUrl: './favorites-page.scss',
  templateUrl: './favorites-page.html',
})
export class FavoritesPage {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly router = inject(Router);

  readonly favorites = this.favoritesStore.favorites;

  openPhoto(id: string) {
    this.router.navigate(['/', AppPath.PhotoDetail, id]);
  }

}

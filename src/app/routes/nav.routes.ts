import { Routes } from '@angular/router';
import { AppPath } from '../core/constants/app-path.constants';

export const navRoutes: Routes = [
  {
    path: AppPath.Photos,
    title: 'Photos',
    loadComponent: () => import('../features/photos/pages/photos-page/photos-page').then((m) => m.PhotosPage)
  },
  {
    path: AppPath.Favorites,
    title: 'Favorites',
    loadComponent: () => import('../features/favorites/pages/favorites-page/favorites-page').then((m) => m.FavoritesPage)
  },
];

import { Routes } from '@angular/router';
import { navRoutes } from './nav.routes';
import { AppPath } from '../core/constants/app-path.constants';

export const routes: Routes = [
    ...navRoutes,
    {
        path: `${AppPath.PhotoDetail}/:id`,
        title: 'Photo',
        loadComponent: () => import('../features/photo-details/pages/photo-details-page/photo-details-page').then((m) => m.PhotoDetailsPage)
    },
    { path: '**', redirectTo: AppPath.Photos },
];

import { Routes } from '@angular/router';
import { navRoutes } from './nav.routes';
import { AppPath } from '../core/constants/app-path.constants';

export const routes: Routes = [
    ...navRoutes,
    { path: '**', redirectTo: AppPath.Photos },
];

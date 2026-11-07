import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeader } from './shared/components/nav-header/nav-header';
import { NavItem } from './shared/components/nav-header/models/nav-item.ui';
import { navRoutes } from './routes/nav.routes';

@Component({
  imports: [RouterOutlet, NavHeader],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly navItems: readonly NavItem[] = navRoutes.map((route) => ({
    label: route.title as string,
    path: `/${route.path}`,
  }));
}

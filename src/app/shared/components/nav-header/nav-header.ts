import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { NavItem } from './models/nav-item.ui';

@Component({
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButton],
  selector: 'app-nav-header',
  styleUrl: './nav-header.scss',
  templateUrl: './nav-header.html',
})
export class NavHeader {
  readonly items = input.required<readonly NavItem[]>();
}

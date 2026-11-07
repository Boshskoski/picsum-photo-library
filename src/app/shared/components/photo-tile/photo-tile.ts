import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatCardModule, MatIconModule],
  selector: 'app-photo-tile',
  styleUrl: './photo-tile.scss',
  templateUrl: './photo-tile.html',
})
export class PhotoTile {
  readonly url = input.required<string>();
  readonly selected = input(false);
  
  readonly tileClick = output<void>();
}

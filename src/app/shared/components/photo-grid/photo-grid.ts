import { Component, input, output } from '@angular/core';
import { PhotoTile } from '../photo-tile/photo-tile';
import { PhotoUrlPipe } from '../../pipes/photo-url-pipe';
import { Photo } from '../../../core/models/ui/photo.ui';

@Component({
  selector: 'app-photo-grid',
  imports: [PhotoTile, PhotoUrlPipe],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  
  readonly isSelected = input<(id: string) => boolean>(() => false);

  readonly photoClick = output<Photo>();
}

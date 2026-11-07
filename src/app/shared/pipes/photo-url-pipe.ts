import { inject, Pipe, PipeTransform } from '@angular/core';
import { PhotoUtil } from '../services/photo-util';
import { PhotoSize } from '../types/photo-size';

@Pipe({
  name: 'photoUrl',
})
export class PhotoUrlPipe implements PipeTransform {
  private readonly photoUtil = inject(PhotoUtil);

  transform(id: string, size: PhotoSize): string {
    return this.photoUtil.buildUrl(id, size);
  }
}

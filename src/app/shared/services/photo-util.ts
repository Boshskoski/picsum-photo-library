import { Service } from '@angular/core';
import { PhotoSize } from '../types/photo-size';
import { PHOTO_DIMENSIONS, PICSUM_SEED_URL } from '../constants/photo-sizes.constants';

@Service()
export class PhotoUtil {
  buildUrl(id: string, size: PhotoSize): string {
    if (!id) {
      throw new Error('A photo id is required to build its url');
    }
    if (!PHOTO_DIMENSIONS[size]) {
      throw new Error('A valid photo size is required to build its url');
    }
    const [width, height] = PHOTO_DIMENSIONS[size];
    return `${PICSUM_SEED_URL}/${encodeURIComponent(id)}/${width}/${height}`;
  }
}

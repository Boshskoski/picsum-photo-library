import { PhotoSize } from '../types/photo-size';

export const PHOTO_DIMENSIONS: Record<PhotoSize, readonly [width: number, height: number]> = {
  thumbnail: [200, 300],
  full: [1200, 1800],
};

export const PICSUM_SEED_URL = 'https://picsum.photos/seed';

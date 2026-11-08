import { TestBed } from '@angular/core/testing';
import { PhotoUtil } from './photo-util';
import { PhotoSize } from '../types/photo-size';

describe('PhotoUtil', () => {
  let photoUtil: PhotoUtil;

  beforeEach(() => {
    photoUtil = TestBed.inject(PhotoUtil);
  });

  it('creates the service', () => {
    expect(photoUtil).toBeTruthy();
  });

  it('builds a seeded 200x300 picsum url for a thumbnail', () => {
    expect(photoUtil.buildUrl('abc123', 'thumbnail')).toBe(
      'https://picsum.photos/seed/abc123/200/300',
    );
  });

  it('gives the same url for the same id every time, so a photo always looks the same', () => {
    expect(photoUtil.buildUrl('abc123', 'thumbnail')).toBe(
      photoUtil.buildUrl('abc123', 'thumbnail'),
    );
  });

  it('gives different urls for different ids', () => {
    expect(photoUtil.buildUrl('abc123', 'thumbnail')).not.toBe(
      photoUtil.buildUrl('abc12', 'thumbnail'),
    );
  });

  it('throws an error if the id is null', () => {
    expect(() => photoUtil.buildUrl(null as unknown as string, 'thumbnail')).toThrow(
      'A photo id is required to build its url',
    );
  });

  it('throws an error if the size is null', () => {
    expect(() => photoUtil.buildUrl('abc123', null as unknown as PhotoSize)).toThrow();
  });
});

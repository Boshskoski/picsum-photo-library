import { TestBed } from '@angular/core/testing';
import { PhotoUrlPipe } from './photo-url-pipe';
import { PhotoUtil } from '../services/photo-util';

describe('PhotoUrlPipe', () => {
  let pipe: PhotoUrlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PhotoUrlPipe] });
    pipe = TestBed.inject(PhotoUrlPipe);
  });

  it.each(['thumbnail', 'full'] as const)('returns the %s url built by PhotoUtilService', (size) => {
    const photoUtil = TestBed.inject(PhotoUtil);

    expect(pipe.transform('abc123', size)).toBe(photoUtil.buildUrl('abc123', size));
  });
});

import { TestBed } from '@angular/core/testing';
import { PhotoGrid } from './photo-grid';
import { Photo } from '../../../core/models/ui/photo.ui';

describe('PhotoGrid', () => {
  const sunsetPhoto: Photo = { id: 'sunset' };
  const forestPhoto: Photo = { id: 'forest' };
  const lakePhoto: Photo = { id: 'lake' };

  function render(photos: Photo[]) {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', photos);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tiles = () => Array.from(element.querySelectorAll('app-photo-tile'));
    const sources = () => tiles().map((tile) => tile.querySelector('img')!.src);

    return { fixture, tiles, sources };
  }

  it('shows a thumbnail tile for every photo, in order', () => {
    const { sources } = render([sunsetPhoto, forestPhoto]);

    expect(sources()).toEqual([
      'https://picsum.photos/seed/sunset/200/300',
      'https://picsum.photos/seed/forest/200/300',
    ]);
  });

  it('shows no tiles when there are no photos', () => {
    const { tiles } = render([]);

    expect(tiles()).toHaveLength(0);
  });

  it('adds a tile when a photo is added', () => {
    const { fixture, tiles } = render([sunsetPhoto, forestPhoto]);

    fixture.componentRef.setInput('photos', [sunsetPhoto, forestPhoto, lakePhoto]);
    fixture.detectChanges();

    expect(tiles()).toHaveLength(3);
  });

  it('keeps the existing tiles when photos are appended, so loaded images do not flicker', () => {
    const { fixture, tiles } = render([sunsetPhoto, forestPhoto]);
    const [sunsetTile, forestTile] = tiles();

    fixture.componentRef.setInput('photos', [sunsetPhoto, forestPhoto, lakePhoto]);
    fixture.detectChanges();

    expect(tiles()[0]).toBe(sunsetTile);
    expect(tiles()[1]).toBe(forestTile);
  });

  it('follows the new order when photos are reordered', () => {
    const { fixture, sources } = render([sunsetPhoto, forestPhoto]);

    fixture.componentRef.setInput('photos', [forestPhoto, sunsetPhoto]);
    fixture.detectChanges();

    expect(sources()).toEqual([
      'https://picsum.photos/seed/forest/200/300',
      'https://picsum.photos/seed/sunset/200/300',
    ]);
  });
});
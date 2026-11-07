import { TestBed } from '@angular/core/testing';
import { PhotoGrid } from './photo-grid';
import { Photo } from '../../../core/models/ui/photo.ui';

describe('PhotoGrid', () => {
  const sunsetPhoto: Photo = { id: 'sunset' };
  const forestPhoto: Photo = { id: 'forest' };
  const lakePhoto: Photo = { id: 'lake' };

  function setup(photos: Photo[], selectedIds?: ReadonlySet<string>) {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', photos);
    if (selectedIds) {
      fixture.componentRef.setInput('selectedIds', selectedIds);
    }
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tiles = () => Array.from(element.querySelectorAll('app-photo-tile'));
    const sources = () => tiles().map((tile) => tile.querySelector('img')!.src);
    const selected = () => tiles().map((tile) => tile.querySelector('mat-icon') !== null);
    const clickTile = (index: number) => tiles()[index].querySelector('button')!.click();

    return { fixture, tiles, sources, selected, clickTile };
  }

  it('shows a thumbnail tile for every photo, in order', () => {
    const { sources } = setup([sunsetPhoto, forestPhoto]);

    expect(sources()).toEqual([
      'https://picsum.photos/seed/sunset/200/300',
      'https://picsum.photos/seed/forest/200/300',
    ]);
  });

  it('shows no tiles when there are no photos', () => {
    const { tiles } = setup([]);

    expect(tiles()).toHaveLength(0);
  });

  it('adds a tile when a photo is added', () => {
    const { fixture, tiles } = setup([sunsetPhoto, forestPhoto]);

    fixture.componentRef.setInput('photos', [sunsetPhoto, forestPhoto, lakePhoto]);
    fixture.detectChanges();

    expect(tiles()).toHaveLength(3);
  });

  it('keeps the existing tiles when photos are appended, so loaded images do not flicker', () => {
    const { fixture, tiles } = setup([sunsetPhoto, forestPhoto]);
    const [sunsetTile, forestTile] = tiles();

    fixture.componentRef.setInput('photos', [sunsetPhoto, forestPhoto, lakePhoto]);
    fixture.detectChanges();

    expect(tiles()[0]).toBe(sunsetTile);
    expect(tiles()[1]).toBe(forestTile);
  });

  it('follows the new order when photos are reordered', () => {
    const { fixture, sources } = setup([sunsetPhoto, forestPhoto]);

    fixture.componentRef.setInput('photos', [forestPhoto, sunsetPhoto]);
    fixture.detectChanges();

    expect(sources()).toEqual([
      'https://picsum.photos/seed/forest/200/300',
      'https://picsum.photos/seed/sunset/200/300',
    ]);
  });

  it('selects no tile by default', () => {
    const { selected } = setup([sunsetPhoto, forestPhoto]);

    expect(selected()).toEqual([false, false]);
  });

  it('selects only the tiles whose photo id is in the selected set', () => {
    const { selected } = setup([sunsetPhoto, forestPhoto, lakePhoto], new Set(['forest']));

    expect(selected()).toEqual([false, true, false]);
  });

  it('emits the photo of the clicked tile', () => {
    const { fixture, clickTile } = setup([sunsetPhoto, forestPhoto]);
    const photoClick = vi.fn();
    fixture.componentInstance.photoClick.subscribe(photoClick);

    clickTile(1);

    expect(photoClick).toHaveBeenCalledOnce();
    expect(photoClick).toHaveBeenCalledWith(forestPhoto);
  });
});
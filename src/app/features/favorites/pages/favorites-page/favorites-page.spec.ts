import { TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites-page';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { FAVORITES_STORAGE_KEY } from '../../../../core/constants/storage-keys.constants';
import { FavoritesStore } from '../../services/store/favorites-store';

describe('FavoritesPage', () => {
  const sunsetPhoto: Photo = { id: 'sunset' };
  const forestPhoto: Photo = { id: 'forest' };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setup() {
    const fixture = TestBed.createComponent(FavoritesPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tiles = () => Array.from(element.querySelectorAll('app-photo-tile'));
    const sources = () => tiles().map((tile) => tile.querySelector('img')!.src);
    const selected = () => tiles().map((tile) => tile.querySelector('mat-icon') !== null);
    const emptyMessage = () => element.querySelector('.favorites__empty')?.textContent ?? null;

    return { fixture, tiles, sources, selected, emptyMessage };
  }

  describe('empty state', () => {
    it('shows the empty state when there are no favorites', () => {
      const { tiles, emptyMessage } = setup();

      expect(emptyMessage()).toContain('No favorites yet');
      expect(tiles()).toHaveLength(0);
    });

    it.each([
      ['a null id', [{ id: null }]],
      ['a missing id', [{}]],
      ['an empty id', [{ id: '' }]],
      ['broken JSON', 'not-valid-json'],
    ])('shows the empty state, not a broken tile, when saved favorites have %s', (_, saved) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        typeof saved === 'string' ? saved : JSON.stringify(saved),
      );

      const { tiles, emptyMessage } = setup();

      expect(emptyMessage()).toContain('No favorites yet');
      expect(tiles()).toHaveLength(0);
    });
  });

  describe('list', () => {
    it('shows a thumbnail tile for every favorite, in the order they were added', () => {
      const favorites = TestBed.inject(FavoritesStore);
      favorites.add(sunsetPhoto);
      favorites.add(forestPhoto);

      const { sources } = setup();

      expect(sources()).toEqual([
        'https://picsum.photos/seed/sunset/200/300',
        'https://picsum.photos/seed/forest/200/300',
      ]);
    });

    it('does not mark tiles as selected, since every photo here is a favorite', () => {
      TestBed.inject(FavoritesStore).add(sunsetPhoto);

      const { selected } = setup();

      expect(selected()).toEqual([false]);
    });

    it('updates while open when a favorite is added or removed elsewhere', () => {
      const favorites = TestBed.inject(FavoritesStore);
      favorites.add(sunsetPhoto);
      const { fixture, tiles, emptyMessage } = setup();

      favorites.add(forestPhoto);
      fixture.detectChanges();
      expect(tiles()).toHaveLength(2);

      favorites.remove(sunsetPhoto.id);
      favorites.remove(forestPhoto.id);
      fixture.detectChanges();
      expect(emptyMessage()).toBe('No favorites yet. Tap a photo in Photos to add it here.');
    });
  });
});
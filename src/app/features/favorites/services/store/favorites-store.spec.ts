import { TestBed } from '@angular/core/testing';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { FavoritesStore } from './favorites-store';
import { FAVORITES_STORAGE_KEY } from '../../../../core/constants/storage-keys.constants';

describe('FavoritesStore', () => {
  const sunset: Photo = { id: 'sunset' };
  const forest: Photo = { id: 'forest' };

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function storeWithSaved(saved: unknown): FavoritesStore {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(saved));
    return TestBed.inject(FavoritesStore);
  }

  it('starts empty', () => {
    expect(TestBed.inject(FavoritesStore).favorites()).toEqual([]);
  });

  it('adds a photo once, even when added twice', () => {
    const store = TestBed.inject(FavoritesStore);

    store.add(sunset);
    store.add(sunset);

    expect(store.favorites()).toEqual([sunset]);
    expect(store.isFavorite(sunset.id)).toBe(true);
  });

  it.each([
    ['a number', 7],
    ['an empty string', ''],
    ['only spaces', '   '],
  ])('starts empty when a saved photo has an id that is %s', (_, id) => {
    expect(storeWithSaved([{ id }]).favorites()).toEqual([]);
  });

  it.each([
    ['a number', 7],
    ['an empty string', ''],
    ['only spaces', '   '],
  ])('does not add a photo whose id is %s', (_, id) => {
    const store = TestBed.inject(FavoritesStore);

    store.add({ id } as unknown as Photo);

    expect(store.favorites()).toEqual([]);
  });

  it('removes a favorite by id and keeps the others', () => {
    const store = TestBed.inject(FavoritesStore);
    store.add(forest);
    store.add(sunset);

    store.remove(forest.id);

    expect(store.favorites()).toEqual([sunset]);
    expect(store.isFavorite(forest.id)).toBe(false);
  });

  it('finds a favorite by id, or undefined when it is not one', () => {
    const store = TestBed.inject(FavoritesStore);
    store.add(sunset);

    expect(store.find(sunset.id)).toEqual(sunset);
    expect(store.find('unknown')).toBeUndefined();
  });

  it('keeps favorites after a page refresh', () => {
    const store = TestBed.inject(FavoritesStore);
    store.add(forest);
    store.add(sunset);
    store.remove(forest.id);

    TestBed.tick();
    TestBed.resetTestingModule();

    expect(TestBed.inject(FavoritesStore).favorites()).toEqual([sunset]);
  });

  it('loads a valid saved list as it is', () => {
    expect(storeWithSaved([forest, sunset]).favorites()).toEqual([forest, sunset]);
  });

  it('starts empty when the saved data is not valid JSON', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, 'not-valid-json');

    expect(TestBed.inject(FavoritesStore).favorites()).toEqual([]);
  });
});

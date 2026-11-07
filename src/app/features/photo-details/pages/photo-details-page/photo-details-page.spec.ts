import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PhotoDetailsPage } from './photo-details-page';
import { FavoritesStore } from '../../../favorites/services/store/favorites-store';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { AppPath } from '../../../../core/constants/app-path.constants';

describe('PhotoDetailsPage', () => {
  const sunsetPhoto: Photo = { id: 'sunset' };
  const forestPhoto: Photo = { id: 'forest' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [PhotoDetailsPage],
      providers: [provideRouter([{ path: AppPath.Favorites, children: [] }])],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setup(id: string, favorites: Photo[] = []) {
    const store = TestBed.inject(FavoritesStore);
    favorites.forEach((photo) => store.add(photo));

    const fixture = TestBed.createComponent(PhotoDetailsPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const viewer = () => element.querySelector('app-photo-viewer');
    const image = () => element.querySelector<HTMLImageElement>('.photo-viewer__image');
    const emptyMessage = () => element.querySelector('.detail__empty')?.textContent ?? null;
    const removeButton = () => element.querySelector<HTMLButtonElement>('button');

    return { fixture, store, viewer, image, emptyMessage, removeButton };
  }

  describe('photo', () => {
    it('shows the full-size image of the favorite with the route id', () => {
      const { image } = setup(sunsetPhoto.id, [sunsetPhoto]);

      expect(image()?.src).toBe(`https://picsum.photos/seed/${sunsetPhoto.id}/1200/1800`);
    });
  });

  describe('empty state', () => {
    it('shows only a message when the id is not a favorite', () => {
      const { viewer, emptyMessage, removeButton } = setup('unknown', [sunsetPhoto]);

      expect(emptyMessage()).toContain('This photo is no longer in your favorites.');
      expect(viewer()).toBeNull();
      expect(removeButton()).toBeNull();
    });

    it('shows the message when the favorite is removed elsewhere while open', () => {
      const { fixture, store, viewer, emptyMessage } = setup(sunsetPhoto.id, [sunsetPhoto]);

      store.remove(sunsetPhoto.id);
      fixture.detectChanges();

      expect(viewer()).toBeNull();
      expect(emptyMessage()).toContain('This photo is no longer in your favorites.');
    });
  });

  describe('removing from favorites', () => {
    it('removes only that favorite and goes back to the favorites page', async () => {
      const { fixture, store, removeButton } = setup(sunsetPhoto.id, [sunsetPhoto, forestPhoto]);

      removeButton()?.click();
      await fixture.whenStable();

      expect(store.favorites()).toEqual([forestPhoto]);
      expect(TestBed.inject(Router).url).toBe(`/${AppPath.Favorites}`);
    });

    it('keeps the favorite until the navigation to the favorites page is successful', async () => {
      vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(false);
      const { fixture, store, viewer, removeButton } = setup(sunsetPhoto.id, [sunsetPhoto]);

      removeButton()?.click();
      await fixture.whenStable();

      expect(store.favorites()).toEqual([sunsetPhoto]);
      expect(viewer()).not.toBeNull();
    });
  });
});

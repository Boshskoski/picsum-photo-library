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
    const image = () => element.querySelector<HTMLImageElement>('.detail__image');
    const placeholder = () => element.querySelector<HTMLImageElement>('.detail__placeholder');
    const spinner = () => element.querySelector('app-loader');
    const emptyMessage = () => element.querySelector('.detail__empty')?.textContent ?? null;
    const errorMessage = () => element.querySelector('.detail__error')?.textContent ?? null;
    const removeButton = () => element.querySelector<HTMLButtonElement>('button');
    const imageLoaded = () => {
      image()?.dispatchEvent(new Event('load'));
      fixture.detectChanges();
    };
    const imageFailed = () => {
      image()?.dispatchEvent(new Event('error'));
      fixture.detectChanges();
    };

    return {
      fixture,
      store,
      image,
      placeholder,
      spinner,
      emptyMessage,
      errorMessage,
      removeButton,
      imageLoaded,
      imageFailed,
    };
  }

  describe('photo', () => {
    it('shows the full-size image of the favorite with the route id', () => {
      const { image } = setup(sunsetPhoto.id, [sunsetPhoto]);

      expect(image()?.src).toBe(`https://picsum.photos/seed/${sunsetPhoto.id}/1200/1800`);
    });

    it('shows the thumbnail and a spinner until the full-size image has loaded', () => {
      const { placeholder, spinner } = setup(sunsetPhoto.id, [sunsetPhoto]);

      expect(placeholder()?.src).toBe(`https://picsum.photos/seed/${sunsetPhoto.id}/200/300`);
      expect(spinner()).not.toBeNull();
    });

    it('hides the thumbnail and the spinner once the full-size image has loaded', () => {
      const { placeholder, spinner, imageLoaded } = setup(sunsetPhoto.id, [sunsetPhoto]);

      imageLoaded();

      expect(placeholder()).toBeNull();
      expect(spinner()).toBeNull();
    });

    it('shows a message instead of the image when the full-size image fails to load', () => {
      const { image, placeholder, spinner, errorMessage, removeButton, imageFailed } = setup(
        sunsetPhoto.id,
        [sunsetPhoto],
      );

      imageFailed();

      expect(errorMessage()).toContain('Could not load image');
      expect(image()).toBeNull();
      expect(placeholder()).toBeNull();
      expect(spinner()).toBeNull();
      expect(removeButton()).not.toBeNull();
    });

    it('shows the thumbnail and the spinner again when the id switches to another photo', () => {
      const { fixture, placeholder, spinner, imageLoaded } = setup(sunsetPhoto.id, [
        sunsetPhoto,
        forestPhoto,
      ]);
      imageLoaded();

      fixture.componentRef.setInput('id', forestPhoto.id);
      fixture.detectChanges();

      expect(placeholder()?.src).toBe(`https://picsum.photos/seed/${forestPhoto.id}/200/300`);
      expect(spinner()).not.toBeNull();
    });
  });

  describe('empty state', () => {
    it('shows only a message when the id is not a favorite', () => {
      const { image, spinner, emptyMessage, removeButton } = setup('unknown', [sunsetPhoto]);

      expect(emptyMessage()).toContain('This photo is no longer in your favorites.');
      expect(image()).toBeNull();
      expect(spinner()).toBeNull();
      expect(removeButton()).toBeNull();
    });

    it('shows the message when the favorite is removed elsewhere while open', () => {
      const { fixture, store, image, emptyMessage } = setup(sunsetPhoto.id, [sunsetPhoto]);

      store.remove(sunsetPhoto.id);
      fixture.detectChanges();

      expect(image()).toBeNull();
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
      const { fixture, store, image, removeButton } = setup(sunsetPhoto.id, [sunsetPhoto]);

      removeButton()?.click();
      await fixture.whenStable();

      expect(store.favorites()).toEqual([sunsetPhoto]);
      expect(image()).not.toBeNull();
    });
  });
});

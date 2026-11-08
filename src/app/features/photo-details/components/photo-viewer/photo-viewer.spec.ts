import { TestBed } from '@angular/core/testing';
import { PhotoViewer } from './photo-viewer';
import { Photo } from '../../../../core/models/ui/photo.ui';

describe('PhotoViewer', () => {
  const sunsetPhoto: Photo = { id: 'sunset' };
  const forestPhoto: Photo = { id: 'forest' };

  function setup(photoId: string) {
    const fixture = TestBed.createComponent(PhotoViewer);
    fixture.componentRef.setInput('photoId', photoId);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const image = () => element.querySelector<HTMLImageElement>('.photo-viewer__image');
    const placeholder = () => element.querySelector<HTMLImageElement>('.photo-viewer__placeholder');
    const spinner = () => element.querySelector('app-loader');
    const errorMessage = () => element.querySelector('.photo-viewer__error')?.textContent ?? null;
    const imageLoaded = () => {
      image()?.dispatchEvent(new Event('load'));
      fixture.detectChanges();
    };
    const imageFailed = () => {
      image()?.dispatchEvent(new Event('error'));
      fixture.detectChanges();
    };

    return { fixture, image, placeholder, spinner, errorMessage, imageLoaded, imageFailed };
  }

  it('shows the thumbnail and a spinner until the full-size image has loaded', () => {
    const { placeholder, spinner } = setup(sunsetPhoto.id);

    expect(placeholder()?.src).toBe(`https://picsum.photos/seed/${sunsetPhoto.id}/200/300`);
    expect(spinner()).not.toBeNull();
  });

  it('hides the spinner and shows the full-size image once it has loaded', () => {
    const { image, spinner, imageLoaded } = setup(sunsetPhoto.id);

    imageLoaded();

    expect(spinner()).toBeNull();
    expect(image()?.classList).not.toContain('photo-viewer__image--loading');
  });

  it('keeps the thumbnail behind the full-size image so it fades in over the blur', () => {
    const { placeholder, imageLoaded } = setup(sunsetPhoto.id);

    imageLoaded();

    expect(placeholder()?.src).toBe(`https://picsum.photos/seed/${sunsetPhoto.id}/200/300`);
  });

  it('shows a message instead of the image when the full-size image fails to load', () => {
    const { image, placeholder, spinner, errorMessage, imageFailed } = setup(sunsetPhoto.id);

    imageFailed();

    expect(errorMessage()).toContain('Could not load image');
    expect(image()).toBeNull();
    expect(placeholder()).toBeNull();
    expect(spinner()).toBeNull();
  });

  it('shows the thumbnail and the spinner again when the id switches to another photo', () => {
    const { fixture, placeholder, spinner, imageLoaded } = setup(sunsetPhoto.id);
    imageLoaded();

    fixture.componentRef.setInput('photoId', forestPhoto.id);
    fixture.detectChanges();

    expect(placeholder()?.src).toBe(`https://picsum.photos/seed/${forestPhoto.id}/200/300`);
    expect(spinner()).not.toBeNull();
  });
});

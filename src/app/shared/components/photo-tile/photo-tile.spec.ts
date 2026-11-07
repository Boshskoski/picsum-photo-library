import { TestBed } from '@angular/core/testing';
import { PhotoTile } from './photo-tile';

describe('PhotoTile', () => {
  function setup(url = 'picsum.photos/1') {
    const fixture = TestBed.createComponent(PhotoTile);
    fixture.componentRef.setInput('url', url);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const source = () => element.querySelector('img')!.getAttribute('src');
    const selected = () => element.querySelector('mat-icon') !== null;
    const click = () => element.querySelector('button')!.click();

    return { fixture, source, selected, click };
  }

  it('shows the image from the given url', () => {
    const { source } = setup('picsum.photos/1');

    expect(source()).toBe('picsum.photos/1');
  });

  it('emits tileClick when clicked', () => {
    const { fixture, click } = setup();
    const tileClick = vi.fn();
    fixture.componentInstance.tileClick.subscribe(tileClick);

    click();

    expect(tileClick).toHaveBeenCalledOnce();
  });

  it('shows as selected only when the selected input is true', () => {
    const { fixture, selected } = setup();
    expect(selected()).toBe(false);

    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();

    expect(selected()).toBe(true);
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoTile } from './photo-tile';

describe('PhotoTile', () => {
  let fixture: ComponentFixture<PhotoTile>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoTile],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoTile);
    element = fixture.nativeElement;
  });

  async function showUrl(url: string): Promise<void> {
    fixture.componentRef.setInput('url', url);
    fixture.detectChanges();
  }

  it('shows the image from the given url', async () => {
    await showUrl('picsum.photos/1');

    expect(element.querySelector('img')?.getAttribute('src')).toBe('picsum.photos/1');
  });
});
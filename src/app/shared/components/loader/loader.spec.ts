import { TestBed } from '@angular/core/testing';
import { Loader } from './loader';

describe('Loader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Loader] });
  });

  it('renders a spinner with the default diameter', () => {
    const fixture = TestBed.createComponent(Loader);
    fixture.detectChanges();

    const spinner = (fixture.nativeElement as HTMLElement).querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
    expect(fixture.componentInstance.diameter()).toBe(40);
  });

  it('draws the spinner at the requested size', () => {
    const fixture = TestBed.createComponent(Loader);
    fixture.componentRef.setInput('diameter', 24);
    fixture.detectChanges();

    const spinner = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('mat-spinner')!;
    expect(spinner.style.width).toBe('24px');
    expect(spinner.style.height).toBe('24px');
  });
});

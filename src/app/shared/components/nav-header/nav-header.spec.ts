import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { NavHeader } from './nav-header';
import { NavItem } from './models/nav-item.ui';
import { AppPath } from '../../../core/constants/app-path.constants';

describe('NavHeader', () => {
  const items: NavItem[] = [
    { label: 'Photos', path: `/${AppPath.Photos}` },
    { label: 'Favorites', path: `/${AppPath.Favorites}` },
  ];

  let fixture: ComponentFixture<NavHeader>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavHeader],
      providers: [provideRouter([{ path: '**', children: [] }])],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavHeader);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  async function goTo(url: string) {
    await router.navigateByUrl(url);
    await fixture.whenStable();
  }

  function links(): HTMLAnchorElement[] {
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a'));
  }

  async function currentPage(): Promise<string | undefined> {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const filledButton = await loader.getHarnessOrNull(MatButtonHarness.with({ appearance: 'filled' }));
    return filledButton?.getText();
  }

  it('renders a link per nav item', () => {
    expect(links().map((link) => link.textContent?.trim())).toEqual(['Photos', 'Favorites']);
    expect(links().map((link) => link.getAttribute('href'))).toEqual([`/${AppPath.Photos}`, `/${AppPath.Favorites}`]);
  });

  it('marks Photos as the current page on the Photos view', async () => {
    await goTo(`/${AppPath.Photos}`);

    expect(await currentPage()).toBe('Photos');
  });

  it('marks Favorites as the current page on the Favorites view', async () => {
    await goTo(`/${AppPath.Favorites}`);

    expect(await currentPage()).toBe('Favorites');
  });

  it('moves the current page when the user switches view', async () => {
    await goTo(`/${AppPath.Photos}`);
    await goTo(`/${AppPath.Favorites}`);

    expect(await currentPage()).toBe('Favorites');
  });

  it('marks no link as current on a page outside the navigation', async () => {
    await goTo(`/${AppPath.PhotoDetail}/abc`);

    expect(await currentPage()).toBeUndefined();
  });

  it('renders no links when given no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(links()).toHaveLength(0);
  });
});

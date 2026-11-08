import { computed, effect, inject, Service, signal } from '@angular/core';
import { Photo } from '../../../../core/models/ui/photo.ui';
import { FAVORITES_STORAGE_KEY } from '../../../../core/constants/storage-keys.constants';
import { StorageUtil } from '../../../../core/services/util/storage-util';

@Service()
export class FavoritesStore {
  private readonly storage = inject(StorageUtil);

  private readonly state = signal<Photo[]>(this.loadFromStorage());

  readonly favorites = this.state.asReadonly();
  readonly favoriteIdSet = computed<ReadonlySet<string>>(
    () => new Set(this.state().map((photo) => photo.id)),
  );

  isFavorite(id: string): boolean {
    return this.favoriteIdSet().has(id);
  }

  add(photo: Photo): void {
    if (this.hasValidId(photo) && !this.isFavorite(photo.id)) {
      this.update([...this.state(), photo]);
    }
  }

  remove(id: string): void {
    this.update(this.state().filter((photo) => photo.id !== id));
  }

  find(id: string): Photo | undefined {
    return this.state().find((photo) => photo.id === id);
  }

  private loadFromStorage(): Photo[] {
    const stored = this.storage.read(FAVORITES_STORAGE_KEY);
    return this.isPhotoArray(stored) ? stored : [];
  }

  private isPhotoArray(value: unknown): value is Photo[] {
    return (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'object' && item !== null && this.hasValidId(item))
    );
  }

  private hasValidId(item: object): item is Photo {
    const id = (item as Partial<Photo>).id;
    return typeof id === 'string' && id.trim().length > 0;
  }

  private update(next: Photo[]): void {
    this.state.set(next);
    this.storage.write(FAVORITES_STORAGE_KEY, next);
  }
}

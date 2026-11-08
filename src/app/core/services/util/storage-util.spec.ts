import { TestBed } from '@angular/core/testing';
import { StorageKey } from '../../types/storage-key';
import { StorageUtil } from './storage-util';

describe('StorageUtil', () => {
  const key: StorageKey = 'photo-library.test.v1';
  let storage: StorageUtil;

  beforeEach(() => {
    storage = TestBed.inject(StorageUtil);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns undefined when nothing was stored for the key', () => {
    expect(storage.read(key)).toBeUndefined();
  });

  it('overwrites an earlier value under the same key', () => {
    storage.write(key, 'first');
    storage.write(key, 'second');

    expect(storage.read(key)).toBe('second');
  });

  it('keeps values under different keys apart', () => {
    const otherKey: StorageKey = 'photo-library.other.v1';

    storage.write(key, 'key-1');
    storage.write(otherKey, 'key-2');

    expect(storage.read(key)).toBe('key-1');
    expect(storage.read(otherKey)).toBe('key-2');
  });

  it('returns undefined instead of throwing for corrupted stored data', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(key, 'not valid json');

    expect(storage.read(key)).toBeUndefined();
  });
});

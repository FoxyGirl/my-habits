import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

const mockStore: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStore[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(mockStore).forEach((key) => delete mockStore[key]);
      return Promise.resolve();
    }),
    getAllKeys: vi.fn(() => Promise.resolve(Object.keys(mockStore))),
    multiGet: vi.fn((keys: string[]) => Promise.resolve(keys.map((key) => [key, mockStore[key] ?? null]))),
    multiSet: vi.fn((pairs: [string, string][]) => {
      pairs.forEach(([key, value]) => {
        mockStore[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: vi.fn((keys: string[]) => {
      keys.forEach((key) => {
        delete mockStore[key];
      });
      return Promise.resolve();
    }),
  },
}));

afterEach(() => {
  cleanup();
  Object.keys(mockStore).forEach((key) => delete mockStore[key]);
});

import { defineConfig, Plugin } from 'vitest/config';
import path from 'path';

function mockTransitiveDeps(): Plugin {
  return {
    name: 'mock-transitive-deps',
    enforce: 'pre',
    resolveId(source: string) {
      if (source === 'react-native-worklets' || source.includes('/react-native-worklets')) {
        return path.resolve(__dirname, './src/__tests__/__mocks__/react-native-worklets.ts');
      }
      if (source === 'react-native-reanimated' || source.includes('/react-native-reanimated')) {
        return path.resolve(__dirname, './src/__tests__/__mocks__/react-native-reanimated.ts');
      }
      if (source === 'react-native-gesture-handler' || source.includes('/react-native-gesture-handler')) {
        return path.resolve(__dirname, './src/__tests__/__mocks__/react-native-gesture-handler.ts');
      }
      if (source === '@gorhom/bottom-sheet' || source.includes('/@gorhom/bottom-sheet')) {
        return path.resolve(__dirname, './src/__tests__/__mocks__/@gorhom/bottom-sheet.ts');
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [mockTransitiveDeps()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
      'react-native-reanimated': path.resolve(__dirname, './src/__tests__/__mocks__/react-native-reanimated.ts'),
      'react-native-worklets': path.resolve(__dirname, './src/__tests__/__mocks__/react-native-worklets.ts'),
      'react-native-gesture-handler': path.resolve(__dirname, './src/__tests__/__mocks__/react-native-gesture-handler.ts'),
      '@gorhom/bottom-sheet': path.resolve(__dirname, './src/__tests__/__mocks__/@gorhom/bottom-sheet.ts'),
      'heroui-native': path.resolve(__dirname, './src/__tests__/__mocks__/heroui-native.tsx'),
    },
  },
});

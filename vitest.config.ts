import { defineConfig, Plugin } from 'vitest/config';
import path from 'path';

const mockReanimated = `
  export const View = 'View';
  export const Text = 'Text';
  export const useSharedValue = () => ({ value: 0 });
  export const useAnimatedStyle = () => ({});
  export const withTiming = (toValue) => toValue;
  export const withSpring = (toValue) => toValue;
  export const withDelay = (delay, animation) => animation;
  export const withSequence = (...animations) => animations[0];
  export const withRepeat = (animation, ...args) => animation;
  export const runOnJS = (fn) => fn;
  export const runOnUI = (fn) => fn;
  export const Easing = {
    inOut: () => ({}),
    ease: () => ({}),
    linear: () => ({}),
    bounce: () => ({}),
    elastic: () => ({}),
    bezier: () => ({}),
    cubic: () => ({}),
    poly: () => ({}),
    quad: () => ({}),
    sin: () => ({}),
    circle: () => ({}),
    exp: () => ({}),
    in: () => ({}),
    out: () => ({}),
  };
  export const interpolate = (value, inputRange, outputRange, options) => outputRange[0];
  export const Extrapolate = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
  export const Extrapolation = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
  export const Keyframe = class Keyframe {
    constructor(data) { this.data = data; }
    duration(ms) { return { duration: ms, ...this.data }; }
  };
  export const useAnimatedGestureHandler = () => ({});
  export const useAnimatedScrollHandler = () => ({});
  export const useDerivedValue = (fn) => ({ value: 0 });
  export const useAnimatedReaction = () => {};
  export const cancelAnimation = () => {};
  export const measure = () => ({});
  export const ScrollView = 'ScrollView';
  export const FlatList = 'FlatList';
  export const LayoutAnimationConfig = ({ children }) => children;
  export const EntryAnimations = {};
  export const ExitAnimations = {};
  export const FadeIn = { build: () => ({}) };
  export const FadeOut = { build: () => ({}) };
  export const SlideInRight = { build: () => ({}) };
  export const SlideOutLeft = { build: () => ({}) };
  export const ZoomIn = { build: () => ({}) };
  export const ZoomOut = { build: () => ({}) };
  const _default = {
    View, Text, useSharedValue, useAnimatedStyle, withTiming, withSpring,
    withDelay, withSequence, withRepeat, runOnJS, runOnUI, Easing,
    interpolate, Extrapolate, Extrapolation, Keyframe, useAnimatedGestureHandler,
    useAnimatedScrollHandler, useDerivedValue, useAnimatedReaction,
    cancelAnimation, measure, ScrollView, FlatList, LayoutAnimationConfig,
    EntryAnimations, ExitAnimations, FadeIn, FadeOut, SlideInRight, SlideOutLeft,
    ZoomIn, ZoomOut,
  };
  export { _default as default };
`;

const mockWorklets = `
  export const Worklets = { createRunOnJS: (fn) => fn };
  export const useWorklet = (fn) => fn;
  export const createWorklet = (fn) => fn;
  export const scheduleOnRN = (fn) => fn;
  export const init = () => {};
  export default { Worklets, useWorklet, createWorklet, scheduleOnRN, init };
`;

const mockGestureHandler = `
  export const GestureHandlerRootView = ({ children }) => children;
  export const Pressable = 'Pressable';
  export const ScrollView = 'ScrollView';
  export const FlatList = 'FlatList';
  export const TouchableOpacity = 'TouchableOpacity';
  export const Gesture = {
    Tap: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
    Pan: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
    Fling: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
    LongPress: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
    Pinch: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
    Rotation: () => ({ onEnd: () => ({ runOnJS: () => {} }) }),
  };
  export const GestureDetector = ({ children }) => children;
  export const GestureHandlerRootViewWithRef = 'GestureHandlerRootViewWithRef';
  export const Directions = { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 };
  export const State = { BEGAN: 1, ACTIVE: 2, END: 3, CANCELLED: 4, FAILED: 5 };
  export const useAnimatedGestureHandler = () => ({});
  export default {
    GestureHandlerRootView, Pressable, ScrollView, FlatList, TouchableOpacity,
    Gesture, GestureDetector, GestureHandlerRootViewWithRef, Directions, State,
    useAnimatedGestureHandler,
  };
`;

const mockBottomSheet = `
  export const BottomSheetModal = ({ children }) => children;
  export const BottomSheetModalProvider = ({ children }) => children;
  export const BottomSheetBackdrop = () => null;
  export const BottomSheetView = ({ children }) => children;
  export const BottomSheetTextInput = 'BottomSheetTextInput';
  export const BottomSheetButton = 'BottomSheetButton';
  export const BottomSheetFlatList = 'BottomSheetFlatList';
  export const BottomSheetScrollView = 'BottomSheetScrollView';
  export const useBottomSheet = () => ({});
  export const useBottomSheetModal = () => ({});
  export default {
    BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop,
    BottomSheetView, BottomSheetTextInput, BottomSheetButton,
    BottomSheetFlatList, BottomSheetScrollView, useBottomSheet, useBottomSheetModal,
  };
`;

function mockNativeModules(): Plugin {
  return {
    name: 'mock-native-modules',
    enforce: 'pre',
    resolveId(id: string, importer: string | undefined) {
      const baseId = id.split('?')[0].split('#')[0];
      if (baseId === 'react-native-reanimated' || baseId.endsWith('/react-native-reanimated')) {
        return '\0mock:react-native-reanimated';
      }
      if (baseId === 'react-native-worklets' || baseId.endsWith('/react-native-worklets')) {
        return '\0mock:react-native-worklets';
      }
      if (baseId === 'react-native-gesture-handler' || baseId.endsWith('/react-native-gesture-handler')) {
        return '\0mock:react-native-gesture-handler';
      }
      if (baseId === '@gorhom/bottom-sheet' || baseId.endsWith('/@gorhom/bottom-sheet')) {
        return '\0mock:gorhom-bottom-sheet';
      }
      return null;
    },
    load(id: string) {
      if (id === '\0mock:react-native-reanimated') return mockReanimated;
      if (id === '\0mock:react-native-worklets') return mockWorklets;
      if (id === '\0mock:react-native-gesture-handler') return mockGestureHandler;
      if (id === '\0mock:gorhom-bottom-sheet') return mockBottomSheet;
      return null;
    },
  };
}

export default defineConfig({
  plugins: [mockNativeModules()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },
    conditions: ['react-native', 'module'],
    mainFields: ['module', 'main'],
  },
});

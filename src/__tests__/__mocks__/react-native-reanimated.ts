export const View = 'View';
export const Text = 'Text';
export const useSharedValue = () => ({ value: 0 });
export const useAnimatedStyle = () => ({});
export const withTiming = (toValue: number) => toValue;
export const withSpring = (toValue: number) => toValue;
export const withDelay = (_delay: number, animation: unknown) => animation;
export const withSequence = (...animations: unknown[]) => animations[0];
export const withRepeat = (animation: unknown, ..._args: unknown[]) => animation;
export const withClamp = (_config: unknown, animation: unknown) => animation;
export const withDecay = (_config: unknown) => ({});
export const runOnJS = (fn: (...args: unknown[]) => void) => fn;
export const runOnUI = (fn: (...args: unknown[]) => void) => fn;
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
  out: (_easing?: unknown) => ({}),
};
export const interpolate = (_value: number, _inputRange: number[], outputRange: number[], _options?: unknown) => outputRange[0];
export const Extrapolate = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
export const Extrapolation = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
export const Keyframe = class Keyframe {
  data: unknown;
  constructor(data: unknown) { this.data = data; }
  duration(ms: number) { return { duration: ms, data: this.data }; }
};
export const useAnimatedGestureHandler = () => ({});
export const useAnimatedScrollHandler = () => ({});
export const useDerivedValue = (_fn: () => number) => ({ value: 0 });
export const useAnimatedReaction = () => {};
export const cancelAnimation = () => {};
export const measure = () => ({});
export const ScrollView = 'ScrollView';
export const FlatList = 'FlatList';
export const LayoutAnimationConfig = ({ children }: { children: React.ReactNode }) => children;
export const EntryAnimations = {};
export const ExitAnimations = {};
export const FadeIn = { build: () => ({}) };
export const FadeOut = { build: () => ({}) };
export const SlideInRight = { build: () => ({}) };
export const SlideOutLeft = { build: () => ({}) };
export const ZoomIn = { build: () => ({}) };
export const ZoomOut = { build: () => ({}) };
export const ReanimatedModule = {};
export const createAnimatedComponent = (component: unknown) => component;
export const Animated = {
  View: 'AnimatedView',
  Text: 'AnimatedText',
  Image: 'AnimatedImage',
  ScrollView: 'AnimatedScrollView',
  FlatList: 'AnimatedFlatList',
};
export const convertToRGBA = () => 'rgba(0,0,0,1)';
export const isColor = (_value: string) => false;
export const ReanimatedLogLevel = { error: 0, warn: 1, info: 2, debug: 3 };
export const DynamicColorIOS = (color: string) => color;
export const PlatformColor = (color: string) => color;
export const processColor = (color: string) => color;
export const InterfaceOrientation = {};
export const IOSReferenceFrame = {};
export const KeyboardState = {};
export const ReduceMotion = {};
export const SensorType = {};
export const defineAnimation = () => {};
export const GentleSpringConfig = {};
export const GentleSpringConfigWithDuration = {};
export const Reanimated3DefaultSpringConfig = {};
export const Reanimated3DefaultSpringConfigWithDuration = {};
export const SnappySpringConfig = {};
export const SnappySpringConfigWithDuration = {};
export const WigglySpringConfig = {};
export const WigglySpringConfigWithDuration = {};
export type SharedValue<T> = { value: T };
export type EntryOrExitLayoutType = { duration: number; data: unknown };

export default {
  View, Text, useSharedValue, useAnimatedStyle, withTiming, withSpring,
  withDelay, withSequence, withRepeat, withClamp, withDecay, runOnJS, runOnUI, Easing,
  interpolate, Extrapolate, Extrapolation, Keyframe, useAnimatedGestureHandler,
  useAnimatedScrollHandler, useDerivedValue, useAnimatedReaction,
  cancelAnimation, measure, ScrollView, FlatList, LayoutAnimationConfig,
  EntryAnimations, ExitAnimations, FadeIn, FadeOut, SlideInRight, SlideOutLeft,
  ZoomIn, ZoomOut, ReanimatedModule, createAnimatedComponent, Animated,
  convertToRGBA, isColor, ReanimatedLogLevel, DynamicColorIOS, PlatformColor,
  processColor, InterfaceOrientation, IOSReferenceFrame, KeyboardState,
  ReduceMotion, SensorType, defineAnimation, GentleSpringConfig,
  GentleSpringConfigWithDuration, Reanimated3DefaultSpringConfig,
  Reanimated3DefaultSpringConfigWithDuration, SnappySpringConfig,
  SnappySpringConfigWithDuration, WigglySpringConfig, WigglySpringConfigWithDuration,
};

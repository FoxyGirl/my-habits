export const View = 'View';
export const Text = 'Text';
export const useSharedValue = () => ({ value: 0 });
export const useAnimatedStyle = () => ({});
export const withTiming = (toValue: number) => toValue;
export const withSpring = (toValue: number) => toValue;
export const runOnJS = (fn: (...args: unknown[]) => void) => fn;
export const Easing = {
  inOut: () => ({}),
  ease: () => ({}),
};
export const interpolate = () => 0;
export const Extrapolate = { CLAMP: 'clamp' };

export default {
  View,
  Text,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
  Extrapolate,
};

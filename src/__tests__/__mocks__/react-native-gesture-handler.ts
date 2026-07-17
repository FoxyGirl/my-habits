export const GestureHandlerRootView = ({ children }: { children: React.ReactNode }) => children;
export const Pressable = 'Pressable';
export const ScrollView = 'ScrollView';
export const FlatList = 'FlatList';
export const TouchableOpacity = 'TouchableOpacity';
export const Gesture = {
  Tap: () => ({
    onEnd: () => ({
      runOnJS: () => {},
    }),
  }),
  Pan: () => ({
    onEnd: () => ({
      runOnJS: () => {},
    }),
  }),
};
export const GestureDetector = ({ children }: { children: React.ReactNode }) => children;

export default {
  GestureHandlerRootView,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Gesture,
  GestureDetector,
};

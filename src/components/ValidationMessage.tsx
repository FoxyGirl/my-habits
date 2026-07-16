import { Text, View } from 'react-native';

import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/styles/tokens';

type ValidationMessageProps = {
  message?: string;
  variant?: 'error' | 'success';
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: typography.regular,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.4,
  },
  errorText: {
    color: colors.error,
  },
  successText: {
    color: colors.success,
  },
});

export function ValidationMessage({ message, variant = 'error' }: ValidationMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          variant === 'error' ? styles.errorText : styles.successText,
        ]}
        accessibilityRole="alert"
      >
        {message}
      </Text>
    </View>
  );
}

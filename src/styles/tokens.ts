import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#17202A',
  mutedText: '#667085',
  primary: '#176B87',
  primaryPressed: '#0F536A',
  border: '#D0D5DD',
  success: '#18794E',
  error: '#B42318',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  regular: 'Roboto_400Regular',
  semibold: 'Roboto_600SemiBold',
  bold: 'Roboto_700Bold',
  title: 32,
  heading: 22,
  body: 16,
  caption: 14,
};

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  screen: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
  },
  card: {
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    maxWidth: 560,
    minHeight: '100%',
    alignSelf: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: typography.title,
    fontWeight: '700',
  },
  heading: {
    color: colors.text,
    fontFamily: typography.semibold,
    fontSize: typography.heading,
    fontWeight: '600',
  },
  body: {
    color: colors.mutedText,
    fontFamily: typography.regular,
    fontSize: typography.body,
  },
  profileFields: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  profileField: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  profileLabel: {
    color: colors.mutedText,
    fontFamily: typography.semibold,
    fontSize: typography.caption,
  },
  profileValue: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: typography.body,
  },
  button: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 'auto',
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  secondaryButton: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontFamily: typography.semibold,
    fontSize: typography.body,
    fontWeight: '600',
  },
  buttonText: {
    color: colors.surface,
    fontFamily: typography.semibold,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

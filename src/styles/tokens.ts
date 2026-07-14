import { css } from 'react-strict-dom';

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
  title: 32,
  heading: 22,
  body: 16,
  caption: 14,
};

export const styles = css.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  screen: {
    display: 'flex',
    flex: 1,
    padding: spacing.md,
    boxSizing: 'border-box',
    overflow: 'scroll',
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    maxWidth: 560,
    minHeight: '100%',
    boxSizing: 'border-box',
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
    fontSize: typography.title,
    fontWeight: '700',
  },
  heading: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '600',
  },
  body: {
    color: colors.mutedText,
    fontSize: typography.body,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryPressed,
      ':active': colors.primaryPressed,
    },
    borderRadius: 10,
    marginTop: 'auto',
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

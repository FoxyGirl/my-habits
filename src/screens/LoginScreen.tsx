import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button, Card } from 'heroui-native';

import { FormField } from '@/components/FormField';
import { PasswordField } from '@/components/PasswordField';
import { useAuth } from '@/state/AuthContext';
import type { LoginErrors } from '@/services/authService';
import { colors, spacing, typography, styles } from '@/styles/tokens';
import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: styles.screen.padding,
    backgroundColor: styles.screen.backgroundColor,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: styles.card.padding,
    gap: styles.card.gap,
    backgroundColor: styles.card.backgroundColor,
    borderRadius: styles.card.borderRadius,
    borderWidth: styles.card.borderWidth,
    borderColor: styles.card.borderColor,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontFamily: typography.regular,
    fontSize: typography.caption,
    color: colors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    fontFamily: typography.regular,
    fontSize: typography.caption,
    color: colors.mutedText,
  },
  linkText: {
    fontFamily: typography.semibold,
    fontSize: typography.caption,
    color: colors.primary,
  },
});

type LoginScreenProps = {
  onNavigateToRegister: () => void;
};

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const { errors: newErrors } = await handleLogin(email, password);
    setErrors(newErrors);
    setIsSubmitting(false);
  }, [email, password, handleLogin]);

  return (
    <ScrollView contentContainerStyle={localStyles.container}>
      <Card style={localStyles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.body}>Sign in to continue managing your habits</Text>

        <FormField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          isRequired
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          testID="login-email"
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          isRequired
          placeholder="Enter your password"
          testID="login-password"
        />

        {errors.general && (
          <View style={localStyles.errorBox}>
            <Text style={localStyles.errorText}>{errors.general}</Text>
          </View>
        )}

        <Button
          variant="primary"
          onPress={handleSubmit}
          isDisabled={isSubmitting}
        >
          <Button.Label>{isSubmitting ? 'Signing in...' : 'Sign in'}</Button.Label>
        </Button>

        <View style={localStyles.footer}>
          <Text style={localStyles.footerText}>Don't have an account? </Text>
          <Button variant="ghost" onPress={onNavigateToRegister} size="sm">
            <Button.Label style={localStyles.linkText}>Register</Button.Label>
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

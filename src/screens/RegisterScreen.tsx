import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button, Card, FieldError, Input, Label, TextField } from 'heroui-native';

import type { Sex } from '@/domain/user';
import { FormField } from '@/components/FormField';
import { PasswordField } from '@/components/PasswordField';
import { useAuth } from '@/state/AuthContext';
import type { RegistrationData, RegistrationErrors } from '@/services/authService';
import { colors, spacing, typography, styles } from '@/styles/tokens';
import { StyleSheet } from 'react-native';

const sexOptions: { label: string; value: Sex }[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'nonBinary' },
  { label: 'Prefer not to say', value: 'preferNotToSay' },
];

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
  sexOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sexOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sexOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sexOptionText: {
    fontFamily: typography.regular,
    fontSize: typography.caption,
    color: colors.text,
  },
  sexOptionTextSelected: {
    color: '#FFFFFF',
  },
  birthDateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  birthDateInput: {
    flex: 1,
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
});

export function RegisterScreen() {
  const { handleRegister } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!sex) {
      setErrors((prev) => ({ ...prev, sex: 'Please select an option' }));
      return;
    }

    setIsSubmitting(true);
    const { errors: newErrors } = await handleRegister({
      fullName,
      email,
      password,
      sex,
      birthDate,
      confirmPassword,
    });
    setErrors(newErrors);
    setIsSubmitting(false);
  }, [fullName, email, password, sex, birthDate, handleRegister]);

  return (
    <ScrollView contentContainerStyle={localStyles.container}>
      <Card style={localStyles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.body}>Fill in your details to get started</Text>

        <FormField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          isRequired
          placeholder="Enter your full name"
          autoCapitalize="words"
          testID="register-full-name"
        />

        <FormField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          isRequired
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          testID="register-email"
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          isRequired
          placeholder="At least 6 characters"
          testID="register-password"
        />

        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          isRequired
          placeholder="Re-enter your password"
          testID="register-confirm-password"
        />

        <TextField isRequired isInvalid={!!errors.sex}>
          <Label>Sex</Label>
          <View style={localStyles.sexOptions}>
            {sexOptions.map((option) => (
              <Button
                key={option.value}
                variant={sex === option.value ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setSex(option.value)}
              >
                <Button.Label>{option.label}</Button.Label>
              </Button>
            ))}
          </View>
          {errors.sex && <FieldError>{errors.sex}</FieldError>}
        </TextField>

        <TextField isRequired isInvalid={!!errors.birthDate}>
          <Label>Birth date</Label>
          <Input
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            testID="register-birth-date"
          />
          {errors.birthDate && <FieldError>{errors.birthDate}</FieldError>}
        </TextField>

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
          <Button.Label>{isSubmitting ? 'Creating account...' : 'Create account'}</Button.Label>
        </Button>
      </Card>
    </ScrollView>
  );
}

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { FieldError, Input, Label, TextField } from 'heroui-native';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  placeholder?: string;
  testID?: string;
};

export function PasswordField({
  label,
  value,
  onChangeText,
  error,
  isRequired,
  placeholder,
  testID,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      <Label>{label}</Label>
      <View className="w-full flex-row items-center">
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!isVisible}
          className="flex-1"
          autoCapitalize="none"
          testID={testID}
        />
        <Pressable
          onPress={() => setIsVisible(!isVisible)}
          className="absolute right-3 p-2"
          accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
        >
          <View
            className={`w-5 h-5 ${isVisible ? 'bg-primary/50' : 'bg-muted/30'}`}
          />
        </Pressable>
      </View>
      {error && <FieldError>{error}</FieldError>}
    </TextField>
  );
}

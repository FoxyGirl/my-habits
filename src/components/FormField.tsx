import { Input, Label, TextField, FieldError } from 'heroui-native';
import type { TextInputProps } from 'react-native';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  testID?: string;
};

export function FormField({
  label,
  value,
  onChangeText,
  error,
  isRequired,
  placeholder,
  keyboardType,
  autoCapitalize,
  testID,
}: FormFieldProps) {
  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      <Label>{label}</Label>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        testID={testID}
      />
      {error && <FieldError>{error}</FieldError>}
    </TextField>
  );
}

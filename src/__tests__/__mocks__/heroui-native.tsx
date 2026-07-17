import React from 'react';

export const Button = ({ children, onPress, isDisabled, variant, size, style, testID, onClick }: Record<string, unknown>) => (
  <button
    onClick={(e) => {
      onClick?.(e);
      onPress?.(e);
    }}
    disabled={isDisabled}
    data-variant={variant}
    data-size={size}
    style={style as React.CSSProperties}
    data-testid={testID as string}
  >
    {children}
  </button>
);

const ButtonLabel = ({ children, style }: Record<string, unknown>) => <span style={style as React.CSSProperties}>{children}</span>;
Button.Label = ButtonLabel;

export const Card = ({ children, style, testID }: Record<string, unknown>) => (
  <div data-testid={testID as string} style={style as React.CSSProperties}>{children}</div>
);

export const TextField = ({ children, isRequired, isInvalid }: Record<string, unknown>) => (
  <div data-required={isRequired} data-invalid={isInvalid}>{children}</div>
);

export const Label = ({ children }: Record<string, unknown>) => <label>{children}</label>;

export const Input = ({ value, onChangeText, placeholder, keyboardType, secureTextEntry, autoCapitalize, testID, style, onChange }: Record<string, unknown>) => (
  <input
    value={value as string}
    onChange={(e) => {
      onChange?.(e);
      onChangeText?.(e.target.value);
    }}
    placeholder={placeholder as string}
    type={secureTextEntry ? 'password' : 'text'}
    data-testid={testID as string}
    style={style as React.CSSProperties}
  />
);

export const FieldError = ({ children }: Record<string, unknown>) => (
  <span role="alert">{children}</span>
);

export const HeroUINativeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Dialog = ({ children, open, onOpenChange }: Record<string, unknown>) => (
  <dialog open={open as boolean} onClose={() => onOpenChange?.(false)}>{children}</dialog>
);
Dialog.Content = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Dialog.Header = ({ children }: Record<string, unknown>) => <header>{children}</header>;
Dialog.Title = ({ children }: Record<string, unknown>) => <h2>{children}</h2>;
Dialog.Description = ({ children }: Record<string, unknown>) => <p>{children}</p>;
Dialog.Footer = ({ children }: Record<string, unknown>) => <footer>{children}</footer>;
Dialog.Trigger = ({ children }: Record<string, unknown>) => <>{children}</>;

export const Accordion = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Accordion.Item = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Accordion.Header = ({ children }: Record<string, unknown>) => <h3>{children}</h3>;
Accordion.Content = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Accordion.Trigger = ({ children }: Record<string, unknown>) => <>{children}</>;

export const Checkbox = ({ children, checked, onCheckedChange, testID }: Record<string, unknown>) => (
  <label>
    <input type="checkbox" checked={checked as boolean} onChange={(e) => onCheckedChange?.(e.target.checked)} data-testid={testID as string} />
    {children}
  </label>
);
Checkbox.Indicator = ({ children }: Record<string, unknown>) => <span>{children}</span>;

export const Divider = ({ style }: Record<string, unknown>) => <hr style={style as React.CSSProperties} />;

export const Popover = ({ children }: Record<string, unknown>) => <>{children}</>;
Popover.Content = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Popover.Trigger = ({ children }: Record<string, unknown>) => <>{children}</>;

export const Progress = ({ value, testID }: Record<string, unknown>) => (
  <progress value={value as number} data-testid={testID as string} />
);

export const RadioGroup = ({ children, value, onValueChange }: Record<string, unknown>) => (
  <div>{children}</div>
);
RadioGroup.Item = ({ children, value }: Record<string, unknown>) => (
  <label><input type="radio" value={value as string} />{children}</label>
);
RadioGroup.Indicator = ({ children }: Record<string, unknown>) => <span>{children}</span>;

export const Select = ({ children, value, onValueChange }: Record<string, unknown>) => (
  <select value={value as string} onChange={(e) => onValueChange?.(e.target.value)}>{children}</select>
);
Select.Content = ({ children }: Record<string, unknown>) => <>{children}</>;
Select.Item = ({ children, value }: Record<string, unknown>) => <option value={value as string}>{children}</option>;
Select.Trigger = ({ children }: Record<string, unknown>) => <>{children}</>;
Select.Value = ({ children }: Record<string, unknown>) => <span>{children}</span>;

export const Switch = ({ checked, onCheckedChange, testID }: Record<string, unknown>) => (
  <button role="switch" aria-checked={checked as boolean} onClick={() => onCheckedChange?.(!checked)} data-testid={testID as string} />
);

export const Tabs = ({ children, value, onValueChange }: Record<string, unknown>) => <div>{children}</div>;
Tabs.List = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Tabs.Trigger = ({ children, value }: Record<string, unknown>) => <button>{children}</button>;
Tabs.Content = ({ children, value }: Record<string, unknown>) => <div>{children}</div>;

export const Toast = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Toast.Description = ({ children }: Record<string, unknown>) => <p>{children}</p>;
Toast.Title = ({ children }: Record<string, unknown>) => <h3>{children}</h3>;
Toast.Viewport = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Toast.Provider = ({ children }: Record<string, unknown>) => <>{children}</>;

export const Tooltip = ({ children }: Record<string, unknown>) => <>{children}</>;
Tooltip.Content = ({ children }: Record<string, unknown>) => <div>{children}</div>;
Tooltip.Trigger = ({ children }: Record<string, unknown>) => <>{children}</>;

export const useTheme = () => ({ theme: 'light', isDark: false });

export default {
  Button, Card, TextField, Label, Input, FieldError, HeroUINativeProvider,
  Dialog, Accordion, Checkbox, Divider, Popover, Progress, RadioGroup,
  Select, Switch, Tabs, Toast, Tooltip, useTheme,
};

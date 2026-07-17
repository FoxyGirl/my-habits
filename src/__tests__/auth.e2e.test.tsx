import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/state/AuthContext';
import { getUsers, saveUser } from '@/storage/repositories';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { LoginScreen } from '@/screens/LoginScreen';

const mockStore: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStore[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(mockStore).forEach((key) => delete mockStore[key]);
      return Promise.resolve();
    }),
    getAllKeys: vi.fn(() => Promise.resolve(Object.keys(mockStore))),
    multiGet: vi.fn((keys: string[]) => Promise.resolve(keys.map((key) => [key, mockStore[key] ?? null]))),
    multiSet: vi.fn((pairs: [string, string][]) => {
      pairs.forEach(([key, value]) => {
        mockStore[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: vi.fn((keys: string[]) => {
      keys.forEach((key) => {
        delete mockStore[key];
      });
      return Promise.resolve();
    }),
  },
}));

const mockNavigateToRegister = vi.fn();

function renderRegisterScreen() {
  return render(
    <AuthProvider>
      <RegisterScreen />
    </AuthProvider>,
  );
}

function renderLoginScreen() {
  return render(
    <AuthProvider>
      <LoginScreen onNavigateToRegister={mockNavigateToRegister} />
    </AuthProvider>,
  );
}

describe('Registration E2E Tests', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
    mockNavigateToRegister.mockClear();
  });

  afterEach(() => {
    screen.unmount();
  });

  it('should successfully register a new user with valid data', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(fullNameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(sexButtons[0]);

    fireEvent.press(createButton);

    await waitFor(async () => {
      const users = await getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].fullName).toBe('Test User');
      expect(users[0].email).toBe('test@example.com');
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    renderRegisterScreen();

    const createButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.press(createButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeTruthy();
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
      expect(screen.getByText('Please confirm your password')).toBeTruthy();
      expect(screen.getByText('Please select an option')).toBeTruthy();
      expect(screen.getByText('Birth date is required')).toBeTruthy();
    });
  });

  it('should show error when passwords do not match', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(fullNameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'differentpassword');
    fireEvent.changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(sexButtons[0]);

    fireEvent.press(createButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('should show error when email already exists', async () => {
    const { rerender } = renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(fullNameInput, 'First User');
    fireEvent.changeText(emailInput, 'duplicate@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(sexButtons[0]);

    fireEvent.press(createButton);

    await waitFor(async () => {
      const users = await getUsers();
      expect(users).toHaveLength(1);
    });

    rerender(
      <AuthProvider>
        <RegisterScreen />
      </AuthProvider>,
    );

    const newFullNameInput = screen.getByTestId('register-full-name');
    const newEmailInput = screen.getByTestId('register-email');
    const newPasswordInput = screen.getByTestId('register-password');
    const newConfirmPasswordInput = screen.getByTestId('register-confirm-password');
    const newBirthDateInput = screen.getByTestId('register-birth-date');
    const newCreateButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(newFullNameInput, 'Second User');
    fireEvent.changeText(newEmailInput, 'duplicate@example.com');
    fireEvent.changeText(newPasswordInput, 'password456');
    fireEvent.changeText(newConfirmPasswordInput, 'password456');
    fireEvent.changeText(newBirthDateInput, '1991-01-01');

    const newSexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(newSexButtons[1]);

    fireEvent.press(newCreateButton);

    await waitFor(() => {
      expect(screen.getByText('An account with this email already exists')).toBeTruthy();
    });
  });

  it('should show error when password is too short', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(fullNameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.changeText(confirmPasswordInput, '12345');
    fireEvent.changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(sexButtons[0]);

    fireEvent.press(createButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should show error when user is under 13 years old', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.changeText(fullNameInput, 'Young User');
    fireEvent.changeText(emailInput, 'young@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.changeText(birthDateInput, '2020-01-01');

    const sexButtons = screen.getAllByRole('button', { name: /female|male|non-binary|prefer not to say/i });
    fireEvent.press(sexButtons[0]);

    fireEvent.press(createButton);

    await waitFor(() => {
      expect(screen.getByText('You must be at least 13 years old')).toBeTruthy();
    });
  });
});

describe('Login E2E Tests', () => {
  beforeEach(async () => {
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
    mockNavigateToRegister.mockClear();

    await saveUser({
      id: 'test-user-1',
      fullName: 'Registered User',
      email: 'registered@example.com',
      passwordHash: '-13c8b3a',
      sex: 'male',
      birthDate: '1990-01-01',
      createdAt: new Date().toISOString(),
    });
  });

  afterEach(() => {
    screen.unmount();
  });

  it('should successfully login with valid credentials', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.changeText(emailInput, 'registered@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(screen.queryByText('Incorrect password')).toBeNull();
      expect(screen.queryByText('No account found')).toBeNull();
    });
  });

  it('should show error when email is not found', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.changeText(emailInput, 'nonexistent@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(screen.getByText('No account found with this email address')).toBeTruthy();
    });
  });

  it('should show error when password is incorrect', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.changeText(emailInput, 'registered@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Incorrect password. Please try again')).toBeTruthy();
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    renderLoginScreen();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });
});

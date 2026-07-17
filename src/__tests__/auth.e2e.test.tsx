import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

function changeText(element: HTMLElement, text: string) {
  fireEvent.change(element, { target: { value: text } });
  fireEvent.input(element, { target: { value: text } });
}

describe('Registration E2E Tests', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
    mockNavigateToRegister.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should successfully register a new user with valid data', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByText('Create account');

    changeText(fullNameInput, 'Test User');
    changeText(emailInput, 'test@example.com');
    changeText(passwordInput, 'password123');
    changeText(confirmPasswordInput, 'password123');
    changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(sexButtons[0]);

    fireEvent.click(createButton);

    await waitFor(async () => {
      const users = await getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].fullName).toBe('Test User');
      expect(users[0].email).toBe('test@example.com');
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    renderRegisterScreen();

    const createButton = screen.getByText('Create account');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Please select an option')).toBeTruthy();
    });
  });

  it('should show error when passwords do not match', async () => {
    renderRegisterScreen();

    const fullNameInput = screen.getByTestId('register-full-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');
    const confirmPasswordInput = screen.getByTestId('register-confirm-password');
    const birthDateInput = screen.getByTestId('register-birth-date');
    const createButton = screen.getByText('Create account');

    changeText(fullNameInput, 'Test User');
    changeText(emailInput, 'test@example.com');
    changeText(passwordInput, 'password123');
    changeText(confirmPasswordInput, 'differentpassword');
    changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(sexButtons[0]);

    fireEvent.click(createButton);

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
    const createButton = screen.getByText('Create account');

    changeText(fullNameInput, 'First User');
    changeText(emailInput, 'duplicate@example.com');
    changeText(passwordInput, 'password123');
    changeText(confirmPasswordInput, 'password123');
    changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(sexButtons[0]);

    fireEvent.click(createButton);

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
    const newCreateButton = screen.getByText('Create account');

    changeText(newFullNameInput, 'Second User');
    changeText(newEmailInput, 'duplicate@example.com');
    changeText(newPasswordInput, 'password456');
    changeText(newConfirmPasswordInput, 'password456');
    changeText(newBirthDateInput, '1991-01-01');

    const newSexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(newSexButtons[1]);

    fireEvent.click(newCreateButton);

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
    const createButton = screen.getByText('Create account');

    changeText(fullNameInput, 'Test User');
    changeText(emailInput, 'test@example.com');
    changeText(passwordInput, '12345');
    changeText(confirmPasswordInput, '12345');
    changeText(birthDateInput, '1990-01-01');

    const sexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(sexButtons[0]);

    fireEvent.click(createButton);

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
    const createButton = screen.getByText('Create account');

    changeText(fullNameInput, 'Young User');
    changeText(emailInput, 'young@example.com');
    changeText(passwordInput, 'password123');
    changeText(confirmPasswordInput, 'password123');
    changeText(birthDateInput, '2020-01-01');

    const sexButtons = screen.getAllByText(/Female|Male|Non-binary|Prefer not to say/);
    fireEvent.click(sexButtons[0]);

    fireEvent.click(createButton);

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
    cleanup();
  });

  it('should successfully login with valid credentials', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByText('Sign in');

    changeText(emailInput, 'registered@example.com');
    changeText(passwordInput, 'password123');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText('Incorrect password')).toBeNull();
      expect(screen.queryByText('No account found')).toBeNull();
    });
  });

  it('should show error when email is not found', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByText('Sign in');

    changeText(emailInput, 'nonexistent@example.com');
    changeText(passwordInput, 'password123');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('No account found with this email address')).toBeTruthy();
    });
  });

  it('should show error when password is incorrect', async () => {
    renderLoginScreen();

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    const signInButton = screen.getByText('Sign in');

    changeText(emailInput, 'registered@example.com');
    changeText(passwordInput, 'wrongpassword');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Incorrect password. Please try again')).toBeTruthy();
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    renderLoginScreen();

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });
});

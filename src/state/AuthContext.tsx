import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { UserProfile } from '@/domain/user';
import { checkExistingSession, loginUser, logoutUser, registerUser } from '@/services/authService';
import type { LoginErrors, RegistrationData, RegistrationErrors } from '@/services/authService';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated'; hasUsers: boolean }
  | { status: 'authenticated'; user: UserProfile };

type AuthContextValue = {
  authState: AuthState;
  handleLogin: (email: string, password: string) => Promise<{ errors: LoginErrors }>;
  handleRegister: (
    data: RegistrationData,
  ) => Promise<{ errors: RegistrationErrors }>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    (async () => {
      try {
        const user = await checkExistingSession();
        if (user) {
          setAuthState({ status: 'authenticated', user });
        } else {
          const { getUsers } = await import('@/storage/repositories');
          const users = await getUsers();
          setAuthState({
            status: 'unauthenticated',
            hasUsers: users.length > 0,
          });
        }
      } catch {
        setAuthState({ status: 'unauthenticated', hasUsers: false });
      }
    })();
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const { session, errors } = await loginUser(email, password);
      if (session) {
        const { getUsers } = await import('@/storage/repositories');
        const users = await getUsers();
        const user = users.find((u) => u.id === session.userId);
        if (user) {
          setAuthState({ status: 'authenticated', user });
        }
      }
      return { errors };
    },
    [],
  );

  const handleRegister = useCallback(
    async (data: RegistrationData) => {
      const { user, errors } = await registerUser(data);
      if (user && Object.keys(errors).length === 0) {
        setAuthState({ status: 'authenticated', user });
      }
      return { errors };
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await logoutUser();
    const { getUsers } = await import('@/storage/repositories');
    const users = await getUsers();
    setAuthState({
      status: 'unauthenticated',
      hasUsers: users.length > 0,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ authState, handleLogin, handleRegister, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { useAuth } from '@/state/AuthContext';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';

export function AppRouter() {
  const { authState } = useAuth();

  if (authState.status === 'loading') {
    return null;
  }

  if (authState.status === 'authenticated') {
    return null;
  }

  if (authState.hasUsers) {
    return <LoginScreen onNavigateToRegister={() => {}} />;
  }

  return <RegisterScreen />;
}

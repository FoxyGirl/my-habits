import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button, Card } from 'heroui-native';

import { mockUser } from '@/domain/mockUser';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { styles } from '@/styles/tokens';

type PreviewScreen = 'registration' | 'login' | 'dashboard';
type AppScreen = PreviewScreen | 'profile';

const screenCopy: Record<PreviewScreen, { heading: string; body: string; action: string }> = {
  registration: {
    heading: 'Create your account',
    body: 'Registration will be implemented in Phase 3.',
    action: 'Preview dashboard',
  },
  login: {
    heading: 'Welcome back',
    body: 'Login will be implemented in Phase 3.',
    action: 'Preview registration',
  },
  dashboard: {
    heading: 'Your habits',
    body: 'Habit management will be implemented in Phase 4.',
    action: 'Preview login',
  },
};

export function AppRouter() {
  const [screen, setScreen] = useState<AppScreen>('registration');
  const previewScreen: PreviewScreen = screen === 'profile' ? 'dashboard' : screen;
  const copy = screenCopy[previewScreen];

  const nextScreen: Record<PreviewScreen, PreviewScreen> = {
    registration: 'dashboard',
    login: 'registration',
    dashboard: 'login',
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.screen}>
        {screen === 'profile' ? (
          <ProfileScreen user={mockUser} onBack={() => setScreen('dashboard')} />
        ) : (
          <Card style={styles.card}>
            <Text style={styles.title}>My Habits</Text>
            <Text style={styles.heading}>{copy.heading}</Text>
            <Text style={styles.body}>{copy.body}</Text>
            <Button
              variant="secondary"
              style={styles.fullWidth}
              onPress={() => setScreen('profile')}
            >
              <Button.Label>View profile</Button.Label>
            </Button>
            <Button
              className="mt-auto w-full"
              onPress={() => setScreen(nextScreen[previewScreen])}
            >
              <Button.Label>{copy.action}</Button.Label>
            </Button>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

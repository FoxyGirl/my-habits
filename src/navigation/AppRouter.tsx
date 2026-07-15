import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
          <View style={styles.card}>
            <Text style={styles.title}>My Habits</Text>
            <Text style={styles.heading}>{copy.heading}</Text>
            <Text style={styles.body}>{copy.body}</Text>
            <Pressable style={styles.secondaryButton} onPress={() => setScreen('profile')}>
              <Text style={styles.secondaryButtonText}>View profile</Text>
            </Pressable>
            <Pressable
              style={({ hovered, pressed }) => [
                styles.button,
                (pressed || hovered) && styles.buttonPressed,
              ]}
              onPress={() => setScreen(nextScreen[previewScreen])}
            >
              <Text style={styles.buttonText}>{copy.action}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

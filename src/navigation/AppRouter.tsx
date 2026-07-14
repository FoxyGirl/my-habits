import { useState } from 'react';
import { html } from 'react-strict-dom';

import { styles } from '@/styles/tokens';

type AppScreen = 'registration' | 'login' | 'dashboard';

const screenCopy: Record<AppScreen, { heading: string; body: string; action: string }> = {
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
  const copy = screenCopy[screen];

  const nextScreen: Record<AppScreen, AppScreen> = {
    registration: 'dashboard',
    login: 'registration',
    dashboard: 'login',
  };

  return (
    <html.div style={styles.root}>
      <html.main data-layoutconformance="strict" style={styles.screen}>
        <html.section style={styles.card}>
          <html.h1 style={styles.title}>
            <html.span>My Habits</html.span>
          </html.h1>
          <html.h2 style={styles.heading}>
            <html.span>{copy.heading}</html.span>
          </html.h2>
          <html.p style={styles.body}>
            <html.span>{copy.body}</html.span>
          </html.p>
          <html.button style={styles.button} onClick={() => setScreen(nextScreen[screen])}>
            <html.span style={styles.buttonText}>{copy.action}</html.span>
          </html.button>
        </html.section>
      </html.main>
    </html.div>
  );
}

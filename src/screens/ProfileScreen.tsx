import type { UserProfile } from '@/domain/user';
import { styles } from '@/styles/tokens';
import { html } from 'react-strict-dom';

type ProfileScreenProps = {
  user: UserProfile;
  onBack: () => void;
};

const sexLabels: Record<UserProfile['sex'], string> = {
  female: 'Female',
  male: 'Male',
  nonBinary: 'Non-binary',
  preferNotToSay: 'Prefer not to say',
};

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <html.div style={styles.profileField}>
      <html.span style={styles.profileLabel}>{label}</html.span>
      <html.span style={styles.profileValue}>{value}</html.span>
    </html.div>
  );
}

export function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  return (
    <html.section style={styles.card}>
      <html.h1 style={styles.title}>
        <html.span>Profile</html.span>
      </html.h1>
      <html.p style={styles.body}>
        <html.span>Your account information</html.span>
      </html.p>
      <html.div style={styles.profileFields}>
        <ProfileField label="Full name" value={user.fullName} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Sex" value={sexLabels[user.sex]} />
        <ProfileField label="Birth date" value={user.birthDate} />
        <ProfileField label="Member since" value={user.createdAt.slice(0, 10)} />
      </html.div>
      <html.button style={styles.button} onClick={onBack}>
        <html.span style={styles.buttonText}>Back to dashboard</html.span>
      </html.button>
    </html.section>
  );
}

import { Text, View } from 'react-native';

import { Button, Card } from 'heroui-native';

import type { UserProfile } from '@/domain/user';
import { styles } from '@/styles/tokens';

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
    <View style={styles.profileField}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

export function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>Your account information</Text>
      <View style={styles.profileFields}>
        <ProfileField label="Full name" value={user.fullName} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Sex" value={sexLabels[user.sex]} />
        <ProfileField label="Birth date" value={user.birthDate} />
        <ProfileField label="Member since" value={user.createdAt.slice(0, 10)} />
      </View>
      <Button className="mt-auto w-full" onPress={onBack}>
        <Button.Label>Back to dashboard</Button.Label>
      </Button>
    </Card>
  );
}

import { Slot } from 'expo-router';
import '../global.css'; // NativeWind
import { AuthProvider } from '../providers/AuthProvider';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Slot />
    </AuthProvider>
  );
}

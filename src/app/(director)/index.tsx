import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function DirectorDashboard() {
  return (
    <View className="flex-1 bg-background p-6">
      <Text className="text-primary text-3xl font-bold mb-4">Espace Directrice</Text>
      <TouchableOpacity 
        className="mt-auto bg-red-900/30 border border-red-500/50 p-4 rounded-xl items-center"
        onPress={() => supabase.auth.signOut()}
      >
        <Text className="text-red-500 font-bold">Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

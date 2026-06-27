import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { Users, BookOpen } from 'lucide-react-native';
import TabLayout from '../../components/TabLayout';

export default function SecretaryDashboard() {
  const { user } = useAuth();

  return (
    <TabLayout role="secretary">
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Secrétariat</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Secrétaire'} 👋</Text>
      </View>

      {/* Grid Menu */}
      <View className="px-6 mb-4">
        <Text className="text-text text-lg font-bold mb-4">Gestion Quotidienne</Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
            <Users size={28} color="#a78bfa" className="mb-3" />
            <Text className="text-text font-bold text-center">Présences</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
            <BookOpen size={28} color="#a78bfa" className="mb-3" />
            <Text className="text-text font-bold text-center">Dossiers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TabLayout>
  );
}

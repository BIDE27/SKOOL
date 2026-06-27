import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Shield } from 'lucide-react-native';

export default function Personnel() {
  const router = useRouter();
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('role', 'parent') // Exclude parents from personnel list
        .order('role');
        
      if (error) throw error;
      setPersonnel(data || []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger le personnel');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'founder': return 'Fondé';
      case 'director': return 'Direction';
      case 'secretary': return 'Secrétaire';
      case 'accountant': return 'Comptable';
      case 'teacher': return 'Enseignant';
      default: return role;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row items-center mb-8 mt-10">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(founder)')} className="mr-4 p-2 bg-surface rounded-full border border-border">
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">
            Administration
          </Text>
          <Text className="text-text text-2xl font-bold">Personnel de l'École</Text>
        </View>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        {loading ? (
          <ActivityIndicator color="#b0ff00" size="large" />
        ) : personnel.length === 0 ? (
          <View className="items-center py-10">
            <User size={48} color="#64748b" className="mb-4" />
            <Text className="text-text text-lg text-center">Aucun membre du personnel trouvé.</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {personnel.map((person) => (
              <View key={person.id} className="flex-row items-center p-4 bg-background border border-border rounded-xl">
                <View className={`p-3 rounded-full mr-4 ${person.role === 'founder' ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                  {person.role === 'founder' || person.role === 'director' ? (
                    <Shield size={20} color={person.role === 'founder' ? '#b0ff00' : '#a78bfa'} />
                  ) : (
                    <User size={20} color="#a78bfa" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-text font-bold text-lg">{person.full_name}</Text>
                  <Text className="text-textMuted text-sm">{person.email}</Text>
                </View>
                <View className="bg-surface border border-border px-3 py-1 rounded-lg">
                  <Text className="text-textMuted text-xs font-semibold uppercase">
                    {getRoleLabel(person.role)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

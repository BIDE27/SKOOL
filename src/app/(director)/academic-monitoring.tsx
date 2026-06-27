import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, GraduationCap, ChevronRight } from 'lucide-react-native';

export default function AcademicMonitoring() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id, 
          name, 
          users (full_name)
        `);
        
      if (error) throw error;
      setClasses(data || []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les classes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row items-center mb-8 mt-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-surface rounded-full border border-border">
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">
            Direction
          </Text>
          <Text className="text-text text-2xl font-bold">Suivi Académique</Text>
        </View>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        <View className="items-center mb-6">
          <View className="bg-primary/20 w-16 h-16 rounded-full items-center justify-center mb-4">
            <GraduationCap size={32} color="#b0ff00" />
          </View>
          <Text className="text-text font-bold text-lg">Classes Actives</Text>
          <Text className="text-textMuted text-center text-sm mt-1">Sélectionnez une classe pour voir les statistiques académiques (Notes, Présences).</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#b0ff00" size="large" />
        ) : classes.length === 0 ? (
          <View className="items-center py-10">
            <BookOpen size={48} color="#64748b" className="mb-4" />
            <Text className="text-text text-lg text-center">Aucune classe n'a été créée.</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {classes.map((c) => (
              <TouchableOpacity key={c.id} className="flex-row items-center p-4 bg-background border border-border rounded-xl">
                <View className="bg-secondary/20 p-3 rounded-full mr-4">
                  <BookOpen size={20} color="#a78bfa" />
                </View>
                <View className="flex-1">
                  <Text className="text-text font-bold text-lg">{c.name}</Text>
                  <Text className="text-textMuted text-sm">Titulaire: {c.users?.full_name || 'Non assigné'}</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

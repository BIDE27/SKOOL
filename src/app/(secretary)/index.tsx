import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { LogOut, UserPlus, Users, BookOpen } from 'lucide-react-native';

export default function SecretaryDashboard() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 mt-10">
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Secrétariat</Text>
          <Text className="text-text text-2xl font-bold">Accueil</Text>
        </View>
        <TouchableOpacity 
          onPress={signOut}
          className="bg-surface p-3 rounded-full border border-border"
        >
          <LogOut size={20} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* Main Actions */}
      <View className="bg-surface p-6 rounded-2xl border border-border mb-6">
        <View className="bg-primary/20 w-12 h-12 rounded-full items-center justify-center mb-4">
          <UserPlus size={24} color="#b0ff00" />
        </View>
        <Text className="text-text text-xl font-bold mb-2">Inscription Élève</Text>
        <Text className="text-textMuted mb-6">
          Ajouter un nouvel élève et l'assigner à une classe.
        </Text>
        
        <TouchableOpacity className="bg-primary rounded-xl py-4 items-center shadow-[0_0_15px_rgba(176,255,0,0.3)]">
          <Text className="text-background font-bold text-lg">Nouvelle Inscription</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Menu */}
      <Text className="text-text text-xl font-bold mb-4">Gestion Quotidienne</Text>
      <View className="flex-row flex-wrap justify-between">
        <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
          <Users size={28} color="#a78bfa" className="mb-3" />
          <Text className="text-text font-bold text-center">Présences Globales</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
          <BookOpen size={28} color="#a78bfa" className="mb-3" />
          <Text className="text-text font-bold text-center">Dossiers Élèves</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

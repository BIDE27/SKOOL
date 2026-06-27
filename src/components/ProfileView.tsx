import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Settings } from 'lucide-react-native';

const ROLE_LABELS: Record<string, string> = {
  founder: 'Fondateur',
  director: 'Directeur',
  accountant: 'Comptable',
  secretary: 'Secrétaire',
  teacher: 'Enseignant',
  parent: 'Parent',
};

export default function ProfileView() {
  const { user, role, signOut } = useAuth();

  const menuItems = [
    { id: '1', title: 'Informations Personnelles', subtitle: 'Gérer vos données de profil', icon: User, color: '#3b82f6' },
    { id: '2', title: 'Paramètres Généraux', subtitle: 'Langues, affichage et thème', icon: Settings, color: '#10b981' },
    { id: '3', title: 'Notifications', subtitle: 'Configurer les alertes de l\'école', icon: Bell, color: '#f59e0b' },
    { id: '4', title: 'Sécurité', subtitle: 'Modifier le mot de passe', icon: Shield, color: '#ec4899' },
    { id: '5', title: 'Aide & Support', subtitle: 'Contacter l\'assistance de l\'école', icon: HelpCircle, color: '#a78bfa' },
  ];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Profil Header */}
      <View className="items-center mt-10 mb-8">
        <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border-2 border-primary mb-4 shadow-lg">
          <Text className="text-primary text-4xl font-extrabold">
            {user?.email?.substring(0, 2).toUpperCase() || 'SK'}
          </Text>
        </View>
        <Text className="text-text text-2xl font-bold mb-1">
          {user?.user_metadata?.full_name || 'Utilisateur'}
        </Text>
        <View className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
          <Text className="text-primary text-xs font-bold uppercase tracking-wider">
            {role ? ROLE_LABELS[role] || role : 'Aucun rôle'}
          </Text>
        </View>
        <Text className="text-textMuted text-sm mt-2">{user?.email}</Text>
      </View>

      {/* Menu Options */}
      <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-8 shadow-lg">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={item.id}
              className={`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}`}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${item.color}20` }}>
                  <Icon size={20} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold text-base">{item.title}</Text>
                  <Text className="text-textMuted text-xs mt-0.5">{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Déconnexion */}
      <TouchableOpacity 
        onPress={signOut}
        className="bg-red-500/10 border border-red-500/20 rounded-xl py-4 flex-row items-center justify-center shadow-md active:bg-red-500/20"
      >
        <LogOut size={20} color="#ef4444" className="mr-2" />
        <Text className="text-red-500 font-bold text-lg">Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

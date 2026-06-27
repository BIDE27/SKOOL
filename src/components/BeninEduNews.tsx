import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BookOpen, Calendar, Trophy, Sparkles, Share2, Heart } from 'lucide-react-native';

const NEWS_DATA = [
  {
    id: '1',
    title: 'Dates des examens 2026 au Bénin : CEP, BEPC et BAC fixés',
    category: 'Officiel',
    date: 'Hier',
    summary: 'Le Ministère a dévoilé le calendrier officiel : le CEP démarrera le 8 juin, le BEPC le 15 juin et le BAC le 22 juin 2026.',
    icon: Calendar,
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Réforme éducation : Codage informatique dans les collèges',
    category: 'Innovation',
    date: 'Il y a 3 jours',
    summary: 'Une phase pilote démarre pour initier les élèves de 6ème au développement web et algorithmique de base dans 20 collèges du Bénin.',
    icon: Sparkles,
    color: '#b0ff00'
  },
  {
    id: '3',
    title: 'Prytanée Militaire de Bembéréké en tête des lycées d\'excellence',
    category: 'Palmarès',
    date: 'Il y a 1 semaine',
    summary: 'Le classement national 2025 consacre à nouveau les écoles militaires et d\'excellence pour leurs taux de réussite exceptionnels.',
    icon: Trophy,
    color: '#a78bfa'
  }
];

const ACTIVITIES_DATA = [
  {
    id: 'a1',
    title: 'Finale Nationale Génie en Herbe',
    description: 'Rendez-vous samedi au Palais des Congrès de Cotonou pour la grande finale inter-collèges.',
    tag: 'Culturel',
    date: '28 Juin',
    likes: '142'
  },
  {
    id: 'a2',
    title: 'Projet Vert : Potagers Scolaires',
    description: 'Plus de 50 écoles primaires à Parakou et Bohicon intègrent le maraîchage pédagogique.',
    tag: 'Écologie',
    date: 'En cours',
    likes: '98'
  },
  {
    id: 'a3',
    title: 'Olympiades des Sciences Physiques',
    description: 'Les inscriptions sont désormais ouvertes pour tous les élèves de Terminale D et C.',
    tag: 'Concours',
    date: 'Jusqu\'au 15 Juil',
    likes: '204'
  }
];

export default function BeninEduNews() {
  return (
    <View className="flex-1 mt-6">
      {/* Actualités */}
      <View className="flex-row justify-between items-center mb-4 px-6">
        <Text className="text-text text-xl font-bold">Actualités Scolaires (Bénin)</Text>
        <Text className="text-primary text-xs font-semibold">Tout voir</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8, marginBottom: 28 }}
      >
        {NEWS_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.id} className="bg-surface border border-border w-72 rounded-2xl mr-4 overflow-hidden shadow-lg">
              <View className="h-32 bg-background/50 relative justify-center items-center">
                <View className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full flex-row items-center bg-background/80 border border-border">
                  <Icon size={12} color={item.color} className="mr-1" />
                  <Text className="text-white text-xs font-semibold">{item.category}</Text>
                </View>
                <BookOpen size={40} color={item.color} />
              </View>
              <View className="p-4">
                <Text className="text-textMuted text-xs mb-1">{item.date}</Text>
                <Text className="text-text font-bold text-base mb-2 leading-tight" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-textMuted text-xs leading-relaxed" numberOfLines={2}>
                  {item.summary}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Activités en Vogue */}
      <View className="px-6 mb-4">
        <Text className="text-text text-xl font-bold">Activités en Vogue 🔥</Text>
      </View>

      <View className="px-6 space-y-4">
        {ACTIVITIES_DATA.map((activity) => (
          <View key={activity.id} className="bg-surface border border-border p-4 rounded-xl mb-4">
            <View className="flex-row justify-between items-start mb-2">
              <View className="px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                <Text className="text-primary text-xs font-bold">{activity.tag}</Text>
              </View>
              <Text className="text-textMuted text-xs font-medium">{activity.date}</Text>
            </View>
            <Text className="text-text font-bold text-base mb-1">{activity.title}</Text>
            <Text className="text-textMuted text-sm mb-3">{activity.description}</Text>
            <View className="flex-row justify-between items-center border-t border-border pt-3">
              <View className="flex-row items-center">
                <Heart size={14} color="#ef4444" className="mr-1" />
                <Text className="text-textMuted text-xs">{activity.likes} j'aime</Text>
              </View>
              <TouchableOpacity className="flex-row items-center">
                <Share2 size={14} color="#64748b" className="mr-1" />
                <Text className="text-textMuted text-xs">Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

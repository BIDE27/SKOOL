import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, User, Plus, X, ArrowRight, DollarSign, Users, GraduationCap, FileText, ClipboardList } from 'lucide-react-native';
import BeninEduNews from './BeninEduNews';
import ProfileView from './ProfileView';

const { width, height } = Dimensions.get('window');

type QuickAction = {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  path: string;
};

const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  accountant: [
    { title: 'Encaisser un paiement', subtitle: 'Valider un paiement cash ou chèque', icon: DollarSign, color: '#b0ff00', path: '/(accountant)/payment-validation' }
  ],
  director: [
    { title: 'Suivi Académique Global', subtitle: 'Consulter les classes et résultats', icon: GraduationCap, color: '#b0ff00', path: '/(director)/academic-monitoring' }
  ],
  founder: [
    { title: 'Gérer le Personnel', subtitle: 'Liste et rôles des employés', icon: Users, color: '#a78bfa', path: '/(founder)/personnel' },
    { title: 'Rapports Financiers', subtitle: 'Historique et bilans financiers', icon: DollarSign, color: '#b0ff00', path: '/(founder)/finances-reports' }
  ],
  secretary: [
    { title: 'Nouvelle Inscription', subtitle: 'Inscrire un nouvel élève', icon: FileText, color: '#3b82f6', path: '/(secretary)/register-student' }
  ],
  teacher: [
    { title: 'Liste de mes élèves', subtitle: 'Consulter et gérer vos classes', icon: Users, color: '#a78bfa', path: '/(teacher)/students-list' }
  ],
  parent: [
    { title: 'Bulletins de Notes', subtitle: 'Consulter les notes de mes enfants', icon: ClipboardList, color: '#b0ff00', path: '#' },
    { title: 'Absences & Suivi', subtitle: 'Voir les retards et absences', icon: ClipboardList, color: '#ef4444', path: '#' }
  ]
};

type TabLayoutProps = {
  role: 'accountant' | 'director' | 'founder' | 'secretary' | 'teacher' | 'parent';
  children: React.ReactNode; // Original dashboard content
};

export default function TabLayout({ role, children }: TabLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [modalVisible, setModalVisible] = useState(false);

  const actions = QUICK_ACTIONS[role] || [];

  const handleActionPress = (path: string) => {
    setModalVisible(false);
    if (path !== '#') {
      router.push(path as any);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Active Tab Content */}
      <View className="flex-1">
        {activeTab === 'home' ? (
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {children}
            <BeninEduNews />
          </ScrollView>
        ) : (
          <ProfileView />
        )}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View className="bg-surface/90 border-t border-border py-2 flex-row justify-around items-center absolute bottom-0 left-0 right-0 h-16 shadow-2xl">
        {/* Home Tab */}
        <TouchableOpacity 
          onPress={() => setActiveTab('home')}
          className="items-center justify-center w-16 h-12"
        >
          <Home size={22} color={activeTab === 'home' ? '#b0ff00' : '#64748b'} />
          <Text 
            className="text-[10px] mt-1 font-bold"
            style={{ color: activeTab === 'home' ? '#b0ff00' : '#64748b' }}
          >
            Accueil
          </Text>
        </TouchableOpacity>

        {/* Circular Floating Plus Button */}
        <View className="relative -top-5">
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-primary/30 border border-primary/50"
          >
            <Plus size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Account Tab */}
        <TouchableOpacity 
          onPress={() => setActiveTab('profile')}
          className="items-center justify-center w-16 h-12"
        >
          <User size={22} color={activeTab === 'profile' ? '#b0ff00' : '#64748b'} />
          <Text 
            className="text-[10px] mt-1 font-bold"
            style={{ color: activeTab === 'profile' ? '#b0ff00' : '#64748b' }}
          >
            Compte
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Drawer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            onPress={() => setModalVisible(false)} 
          />
          <View className="bg-surface border-t border-border rounded-t-[32px] w-full px-6 pt-6 pb-12 shadow-2xl">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-text text-xl font-extrabold">Actions Rapides</Text>
                <Text className="text-textMuted text-xs mt-0.5">Que souhaitez-vous faire ?</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                className="bg-background border border-border p-2 rounded-full"
              >
                <X size={20} color="#f8fafc" />
              </TouchableOpacity>
            </View>

            {/* Actions Grid */}
            <View className="space-y-3">
              {actions.length === 0 ? (
                <Text className="text-textMuted text-center my-6">Aucune action rapide disponible.</Text>
              ) : (
                actions.map((act, index) => {
                  const Icon = act.icon;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleActionPress(act.path)}
                      className="bg-background border border-border p-4 rounded-xl flex-row items-center justify-between mb-3"
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${act.color}20` }}>
                          <Icon size={20} color={act.color} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-text font-bold text-base">{act.title}</Text>
                          <Text className="text-textMuted text-xs mt-0.5">{act.subtitle}</Text>
                        </View>
                      </View>
                      <ArrowRight size={18} color="#b0ff00" />
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
});

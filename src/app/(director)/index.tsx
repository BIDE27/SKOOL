import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { LogOut, MessageSquare, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react-native';

export default function DirectorDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('id, title, description, status, created_at, users(full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderComplaint = ({ item }: { item: any }) => (
    <View className="bg-surface p-4 rounded-xl border border-border mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-text font-bold text-lg flex-1">{item.title}</Text>
        {item.status === 'open' ? (
          <View className="bg-red-500/20 px-2 py-1 rounded flex-row items-center ml-2">
            <AlertCircle size={12} color="#ef4444" className="mr-1" />
            <Text className="text-red-500 text-xs font-bold uppercase">Ouverte</Text>
          </View>
        ) : (
          <View className="bg-primary/20 px-2 py-1 rounded flex-row items-center ml-2">
            <CheckCircle size={12} color="#b0ff00" className="mr-1" />
            <Text className="text-primary text-xs font-bold uppercase">Résolue</Text>
          </View>
        )}
      </View>
      <Text className="text-textMuted text-sm mb-3">{item.description}</Text>
      <View className="flex-row justify-between items-center border-t border-border pt-3">
        <Text className="text-textMuted text-xs">De: {item.users?.full_name || 'Parent inconnu'}</Text>
        <Text className="text-textMuted text-xs">{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-10 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Direction</Text>
          <Text className="text-text text-2xl font-bold">Tableau de Bord</Text>
        </View>
        <TouchableOpacity 
          onPress={signOut}
          className="bg-surface p-3 rounded-full border border-border"
        >
          <LogOut size={20} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      <View className="px-6 flex-1">
        {/* Quick Academic Action */}
        <TouchableOpacity 
          onPress={() => router.push('/(director)/academic-monitoring')}
          className="bg-primary rounded-xl py-4 items-center flex-row justify-center mb-6 shadow-[0_0_15px_rgba(176,255,0,0.3)]"
        >
          <GraduationCap size={20} color="#000" className="mr-2" />
          <Text className="text-background font-bold text-lg">Suivi Académique Global</Text>
        </TouchableOpacity>

        {/* Complaints Section */}
        <View className="flex-row items-center mb-4">
          <MessageSquare size={20} color="#a78bfa" className="mr-2" />
          <Text className="text-text text-xl font-bold">Plaintes des Parents</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#b0ff00" className="mt-10" />
        ) : complaints.length === 0 ? (
          <Text className="text-textMuted text-center mt-10">Aucune plainte à afficher.</Text>
        ) : (
          <FlatList 
            data={complaints}
            keyExtractor={item => item.id}
            renderItem={renderComplaint}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
}

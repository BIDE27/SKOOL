import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react-native';
import TabLayout from '../../components/TabLayout';

export default function DirectorDashboard() {
  const { user } = useAuth();
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
    <TabLayout role="director">
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Direction</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Directrice'} 👋</Text>
      </View>

      <View className="px-6 flex-1 max-h-[350px] mb-4">
        {/* Complaints Section */}
        <View className="flex-row items-center mb-4">
          <MessageSquare size={20} color="#a78bfa" className="mr-2" />
          <Text className="text-text text-xl font-bold">Plaintes Récentes</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#b0ff00" className="mt-10" />
        ) : complaints.length === 0 ? (
          <Text className="text-textMuted text-center mt-10">Aucune plainte à afficher.</Text>
        ) : (
          <View className="space-y-4">
            {complaints.slice(0, 2).map((item) => (
              <View key={item.id}>
                {renderComplaint({ item })}
              </View>
            ))}
          </View>
        )}
      </View>
    </TabLayout>
  );
}

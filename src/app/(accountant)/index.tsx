import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { DollarSign, CheckCircle } from 'lucide-react-native';
import TabLayout from '../../components/TabLayout';

export default function AccountantDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id, amount, status, transaction_ref, created_at, users(full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderPayment = ({ item }: { item: any }) => (
    <View className="bg-surface p-4 rounded-xl border border-border mb-3 flex-row justify-between items-center">
      <View>
        <Text className="text-text font-bold text-lg">{item.amount.toLocaleString()} CFA</Text>
        <Text className="text-textMuted text-sm">Réf: {item.transaction_ref}</Text>
        <Text className="text-textMuted text-xs mt-1">
          Parent: {item.users ? item.users.full_name : 'Inconnu'}
        </Text>
      </View>
      <View className="items-end">
        {item.status === 'completed' ? (
          <View className="bg-primary/20 px-3 py-1 rounded-full flex-row items-center">
            <CheckCircle size={12} color="#b0ff00" className="mr-1" />
            <Text className="text-primary text-xs font-bold uppercase">Payé</Text>
          </View>
        ) : (
          <View className="bg-yellow-500/20 px-3 py-1 rounded-full">
            <Text className="text-yellow-500 text-xs font-bold uppercase">{item.status}</Text>
          </View>
        )}
        <Text className="text-textMuted text-xs mt-2">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <TabLayout role="accountant">
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Comptable</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Comptable'} 👋</Text>
      </View>

      <View className="px-6 flex-1 max-h-[350px] mb-4">
        <View className="flex-row items-center mb-4">
          <DollarSign size={20} color="#b0ff00" className="mr-2" />
          <Text className="text-text text-xl font-bold">Historique Récent</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator color="#b0ff00" className="mt-10" />
        ) : payments.length === 0 ? (
          <Text className="text-textMuted text-center mt-10">Aucun paiement enregistré.</Text>
        ) : (
          <View className="space-y-3">
            {payments.slice(0, 3).map((item) => (
              <View key={item.id}>
                {renderPayment({ item })}
              </View>
            ))}
          </View>
        )}
      </View>
    </TabLayout>
  );
}

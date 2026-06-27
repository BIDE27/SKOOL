import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';

export default function FinancesReports() {
  const router = useRouter();
  const [finances, setFinances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const records = data || [];
      setFinances(records);
      
      let inc = 0;
      let exp = 0;
      records.forEach(r => {
        if (r.transaction_type === 'income') inc += Number(r.amount);
        if (r.transaction_type === 'expense') exp += Number(r.amount);
      });
      
      setTotalIncome(inc);
      setTotalExpense(exp);
      
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les rapports financiers');
    } finally {
      setLoading(false);
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
          <Text className="text-text text-2xl font-bold">Rapports Financiers</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-6">
        <View className="bg-surface w-[48%] p-4 rounded-2xl border border-border">
          <View className="flex-row items-center mb-2">
            <TrendingUp size={16} color="#b0ff00" className="mr-2" />
            <Text className="text-textMuted text-xs uppercase tracking-wider">Revenus</Text>
          </View>
          <Text className="text-text text-xl font-bold">{totalIncome.toLocaleString()} F</Text>
        </View>
        <View className="bg-surface w-[48%] p-4 rounded-2xl border border-border">
          <View className="flex-row items-center mb-2">
            <TrendingDown size={16} color="#ef4444" className="mr-2" />
            <Text className="text-textMuted text-xs uppercase tracking-wider">Dépenses</Text>
          </View>
          <Text className="text-text text-xl font-bold">{totalExpense.toLocaleString()} F</Text>
        </View>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        <Text className="text-text text-lg font-bold mb-4">Historique des Transactions</Text>
        
        {loading ? (
          <ActivityIndicator color="#b0ff00" size="large" />
        ) : finances.length === 0 ? (
          <View className="items-center py-10">
            <Wallet size={48} color="#64748b" className="mb-4" />
            <Text className="text-text text-lg text-center">Aucune transaction enregistrée.</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {finances.map((record) => (
              <View key={record.id} className="flex-row items-center justify-between p-4 bg-background border border-border rounded-xl">
                <View className="flex-row items-center flex-1">
                  <View className={`p-3 rounded-full mr-4 ${record.transaction_type === 'income' ? 'bg-primary/20' : 'bg-red-500/20'}`}>
                    {record.transaction_type === 'income' ? (
                      <TrendingUp size={20} color="#b0ff00" />
                    ) : (
                      <TrendingDown size={20} color="#ef4444" />
                    )}
                  </View>
                  <View className="flex-1 mr-2">
                    <Text className="text-text font-bold text-base" numberOfLines={1}>{record.description}</Text>
                    <Text className="text-textMuted text-xs">
                      {new Date(record.created_at).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
                <Text className={`font-bold text-lg ${record.transaction_type === 'income' ? 'text-primary' : 'text-red-500'}`}>
                  {record.transaction_type === 'income' ? '+' : '-'}{Number(record.amount).toLocaleString()} F
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

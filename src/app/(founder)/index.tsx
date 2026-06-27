import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { Users, Wallet, AlertCircle, Calendar } from 'lucide-react-native';
import TabLayout from '../../components/TabLayout';

export default function FounderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalIncome: 0,
    openComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch income
      const { data: finances } = await supabase
        .from('finances')
        .select('amount')
        .eq('transaction_type', 'income');
      
      const income = finances?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // Fetch open complaints
      const { count: complaintsCount } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      setStats({
        totalStudents: studentsCount || 0,
        totalIncome: income,
        openComplaints: complaintsCount || 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#b0ff00" />
      </View>
    );
  }

  return (
    <TabLayout role="founder">
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Fondé</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Fondateur'} 👋</Text>
      </View>

      {/* KPI Grid */}
      <View className="flex-row flex-wrap justify-between px-6 mb-4">
        {/* Students */}
        <View className="bg-surface w-[48%] p-4 rounded-2xl mb-4 border border-border">
          <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center mb-3">
            <Users size={16} color="#b0ff00" />
          </View>
          <Text className="text-text text-2xl font-bold mb-1">{stats.totalStudents}</Text>
          <Text className="text-textMuted text-[10px] uppercase tracking-wider">Élèves</Text>
        </View>

        {/* Income */}
        <View className="bg-surface w-[48%] p-4 rounded-2xl mb-4 border border-border">
          <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center mb-3">
            <Wallet size={16} color="#b0ff00" />
          </View>
          <Text className="text-text text-xl font-bold mb-1">{stats.totalIncome.toLocaleString()} F</Text>
          <Text className="text-textMuted text-[10px] uppercase tracking-wider">Revenus (CFA)</Text>
        </View>

        {/* Complaints */}
        <View className="bg-surface w-[48%] p-4 rounded-2xl mb-4 border border-border">
          <View className="bg-red-500/20 w-8 h-8 rounded-full items-center justify-center mb-3">
            <AlertCircle size={16} color="#ef4444" />
          </View>
          <Text className="text-text text-2xl font-bold mb-1">{stats.openComplaints}</Text>
          <Text className="text-textMuted text-[10px] uppercase tracking-wider">Plaintes</Text>
        </View>
        
        {/* Attendance Rate */}
        <View className="bg-surface w-[48%] p-4 rounded-2xl mb-4 border border-border">
          <View className="bg-secondary/20 w-8 h-8 rounded-full items-center justify-center mb-3">
            <Calendar size={16} color="#a78bfa" />
          </View>
          <Text className="text-text text-2xl font-bold mb-1">98%</Text>
          <Text className="text-textMuted text-[10px] uppercase tracking-wider">Présence</Text>
        </View>
      </View>
    </TabLayout>
  );
}

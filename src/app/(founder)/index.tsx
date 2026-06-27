import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { Users, Wallet, AlertCircle, Calendar, LogOut } from 'lucide-react-native';

export default function FounderDashboard() {
  const { user } = useAuth();
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

      // Fetch income (simulated sum, as postgrest doesn't do sum easily without rpc, we fetch and reduce for MVP)
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 mt-10">
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Fondé</Text>
          <Text className="text-text text-2xl font-bold">Vue d'ensemble</Text>
        </View>
        <TouchableOpacity 
          onPress={() => supabase.auth.signOut()}
          className="bg-surface p-3 rounded-full border border-border"
        >
          <LogOut size={20} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* KPI Grid */}
      <View className="flex-row flex-wrap justify-between">
        {/* Students */}
        <View className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border">
          <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center mb-4">
            <Users size={20} color="#b0ff00" />
          </View>
          <Text className="text-text text-3xl font-bold mb-1">{stats.totalStudents}</Text>
          <Text className="text-textMuted text-xs uppercase tracking-wider">Élèves</Text>
        </View>

        {/* Income */}
        <View className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border">
          <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center mb-4">
            <Wallet size={20} color="#b0ff00" />
          </View>
          <Text className="text-text text-2xl font-bold mb-1">{stats.totalIncome.toLocaleString()} F</Text>
          <Text className="text-textMuted text-xs uppercase tracking-wider">Revenus (CFA)</Text>
        </View>

        {/* Complaints */}
        <View className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border">
          <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center mb-4">
            <AlertCircle size={20} color="#ef4444" />
          </View>
          <Text className="text-text text-3xl font-bold mb-1">{stats.openComplaints}</Text>
          <Text className="text-textMuted text-xs uppercase tracking-wider">Plaintes</Text>
        </View>
        
        {/* Attendance Rate (Placeholder) */}
        <View className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border">
          <View className="bg-secondary/20 w-10 h-10 rounded-full items-center justify-center mb-4">
            <Calendar size={20} color="#a78bfa" />
          </View>
          <Text className="text-text text-3xl font-bold mb-1">98%</Text>
          <Text className="text-textMuted text-xs uppercase tracking-wider">Présence Globale</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text className="text-text text-xl font-bold mt-6 mb-4">Actions Rapides</Text>
      <View className="space-y-3">
        <TouchableOpacity className="bg-surface border border-border p-4 rounded-xl flex-row items-center justify-between">
          <Text className="text-text font-semibold">Gérer le Personnel</Text>
          <Text className="text-primary">→</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-surface border border-border p-4 rounded-xl flex-row items-center justify-between">
          <Text className="text-text font-semibold">Rapports Financiers</Text>
          <Text className="text-primary">→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

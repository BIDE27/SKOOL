import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react-native';

export default function PaymentValidation() {
  const router = useRouter();
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'parent');
        
      if (error) throw error;
      setParents(data || []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les parents');
    } finally {
      setFetching(false);
    }
  };

  const handleValidate = async () => {
    if (!amount.trim() || !selectedParent) {
      Alert.alert('Erreur', 'Veuillez sélectionner un parent et entrer un montant.');
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert('Erreur', 'Le montant doit être un nombre valide.');
      return;
    }

    setLoading(true);
    try {
      // Create payment record
      const { error: paymentError } = await supabase.from('payments').insert({
        parent_id: selectedParent,
        amount: Number(amount),
        status: 'completed',
        transaction_ref: 'CASH-' + Math.floor(Math.random() * 1000000)
      });

      if (paymentError) throw paymentError;

      // Update global finances
      const { error: financeError } = await supabase.from('finances').insert({
        transaction_type: 'income',
        amount: Number(amount),
        description: 'Paiement scolarité (Caisse)',
      });

      if (financeError) throw financeError;
      
      Alert.alert('Succès', 'Paiement validé et enregistré en caisse !', [
        { text: 'OK', onPress: () => router.canGoBack() ? router.back() : router.replace('/(accountant)') }
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row items-center mb-8 mt-10">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(accountant)')} className="mr-4 p-2 bg-surface rounded-full border border-border">
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">
            Comptabilité
          </Text>
          <Text className="text-text text-2xl font-bold">Encaisser Paiement</Text>
        </View>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        <View className="items-center mb-6">
          <View className="bg-primary/20 w-16 h-16 rounded-full items-center justify-center mb-4">
            <CreditCard size={32} color="#b0ff00" />
          </View>
          <Text className="text-text font-bold text-lg">Paiement Espèce / Chèque</Text>
          <Text className="text-textMuted text-center text-sm mt-1">Validez un paiement effectué directement à la caisse de l'école.</Text>
        </View>

        <View className="mb-4">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Montant (CFA)</Text>
          <TextInput
            className="w-full bg-background text-text border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors font-bold text-lg"
            placeholder="Ex: 25000"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View className="mb-8">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Parent Payeur</Text>
          
          {fetching ? (
            <ActivityIndicator color="#a78bfa" />
          ) : parents.length === 0 ? (
            <Text className="text-red-500">Aucun parent trouvé.</Text>
          ) : (
            <View className="space-y-2 mt-2">
              {parents.map((p) => (
                <TouchableOpacity 
                  key={p.id}
                  onPress={() => setSelectedParent(p.id)}
                  className={`p-4 rounded-xl border flex-row justify-between items-center ${selectedParent === p.id ? 'bg-primary/10 border-primary' : 'bg-background border-border'}`}
                >
                  <View>
                    <Text className="text-text font-bold">{p.full_name}</Text>
                    <Text className="text-textMuted text-xs">{p.email}</Text>
                  </View>
                  {selectedParent === p.id && <CheckCircle size={20} color="#b0ff00" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          onPress={handleValidate} 
          disabled={loading || !selectedParent || !amount}
          className={`w-full rounded-xl py-4 items-center flex-row justify-center shadow-lg ${(!selectedParent || !amount) ? 'bg-gray-600' : 'bg-primary shadow-[0_0_15px_rgba(176,255,0,0.3)]'}`}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-background font-bold text-lg">Valider l'Encaissement</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

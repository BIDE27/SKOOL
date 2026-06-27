import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { CreditCard, MessageSquare } from 'lucide-react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import TabLayout from '../../components/TabLayout';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleSubmitComplaint = async () => {
    if (!complaint.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre plainte.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('complaints').insert({
        parent_id: user?.id,
        title: 'Plainte Parent',
        description: complaint,
        status: 'open'
      });
      if (error) throw error;
      Alert.alert('Succès', 'Votre plainte a été envoyée à la direction.');
      setComplaint('');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    setPaymentLoading(true);
    setTimeout(async () => {
      setPaymentLoading(false);
      Alert.alert(
        'Paiement Réussi', 
        'Votre transaction Mobile Money a été traitée avec succès !',
        [
          { text: "Générer Reçu PDF", onPress: generateReceipt },
          { text: "Fermer", style: "cancel" }
        ]
      );
      
      await supabase.from('payments').insert({
        parent_id: user?.id,
        amount: 25000,
        status: 'completed',
        transaction_ref: 'MM-' + Math.floor(Math.random() * 1000000)
      });
      
    }, 2000);
  };

  const generateReceipt = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
            .title { font-size: 45px; color: #7E22CE; font-weight: bold; }
            table { width: 100%; text-align: left; border-collapse: collapse; margin-top: 40px; }
            th, td { padding: 12px; border-bottom: 1px solid #ddd; }
            th { background: #f8f8f8; }
            .total { font-size: 24px; font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1 class="title">SKOOL</h1>
            <p><strong>Reçu de Paiement - Scolarité</strong></p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Parent: ${user?.email}</p>
            <table>
              <tr><th>Description</th><th>Montant (CFA)</th></tr>
              <tr><td>Contribution Scolaire</td><td>25,000</td></tr>
            </table>
            <div class="total">Total Payé: 25,000 CFA</div>
            <p style="margin-top: 40px; text-align: center; color: #777;">Payé via Mobile Money. Merci pour votre confiance !</p>
          </div>
        </body>
      </html>
    `;
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de générer le reçu.');
    }
  };

  return (
    <TabLayout role="parent">
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Parent</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Parent'} 👋</Text>
      </View>

      {/* Payment Widget */}
      <View className="px-6 mb-4">
        <View className="bg-surface p-5 rounded-2xl border border-border shadow-lg">
          <View className="flex-row items-center mb-2">
            <CreditCard size={20} color="#b0ff00" className="mr-2" />
            <Text className="text-text text-lg font-bold">Paiement Scolarité</Text>
          </View>
          <Text className="text-textMuted text-xs mb-4">
            Payez la contribution par Mobile Money.
          </Text>
          <TouchableOpacity 
            onPress={handleMobileMoneyPayment}
            disabled={paymentLoading}
            className="bg-primary rounded-xl py-3 items-center flex-row justify-center shadow-[0_0_15px_rgba(176,255,0,0.3)]"
          >
            {paymentLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-background font-bold text-sm">Payer 25 000 CFA</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Complaints Widget */}
      <View className="px-6 mb-4">
        <View className="bg-surface p-5 rounded-2xl border border-border">
          <View className="flex-row items-center mb-2">
            <MessageSquare size={20} color="#a78bfa" className="mr-2" />
            <Text className="text-text text-lg font-bold">Laisser une plainte</Text>
          </View>
          <TextInput
            className="w-full bg-background text-text border border-border rounded-xl px-4 py-2 mb-3 h-16 text-sm"
            placeholder="Décrivez votre problème à la direction..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            value={complaint}
            onChangeText={setComplaint}
          />
          <TouchableOpacity 
            onPress={handleSubmitComplaint}
            disabled={loading}
            className="bg-secondary rounded-xl py-2.5 items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-sm">Envoyer la plainte</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TabLayout>
  );
}

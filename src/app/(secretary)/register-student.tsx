import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react-native';

export default function RegisterStudent() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
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
      if (data && data.length > 0) {
        setSelectedParent(data[0].id);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les parents');
    } finally {
      setFetching(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !selectedParent) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('students').insert({
        full_name: fullName,
        parent_id: selectedParent,
        // date_of_birth: dob // Optional for now
      });

      if (error) throw error;
      
      Alert.alert('Succès', 'Élève inscrit avec succès !', [
        { text: 'OK', onPress: () => router.back() }
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
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-surface rounded-full">
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text className="text-text text-2xl font-bold">Nouvelle Inscription</Text>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        <View className="items-center mb-6">
          <View className="bg-primary/20 w-16 h-16 rounded-full items-center justify-center mb-4">
            <UserPlus size={32} color="#b0ff00" />
          </View>
          <Text className="text-textMuted text-center">Ajouter un élève et l'assigner à un parent existant.</Text>
        </View>

        <View className="mb-4">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Nom Complet de l'Élève</Text>
          <TextInput
            className="w-full bg-background text-text border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
            placeholder="Ex: Jean Dupont"
            placeholderTextColor="#64748b"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="mb-8">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Parent Responsable</Text>
          
          {fetching ? (
            <ActivityIndicator color="#a78bfa" />
          ) : parents.length === 0 ? (
            <Text className="text-red-500">Aucun parent trouvé. Veuillez d'abord créer un compte parent.</Text>
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
          onPress={handleRegister} 
          disabled={loading || !selectedParent}
          className={`w-full rounded-xl py-4 items-center flex-row justify-center shadow-lg ${!selectedParent ? 'bg-gray-600' : 'bg-primary shadow-[0_0_15px_rgba(176,255,0,0.3)]'}`}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-background font-bold text-lg">Inscrire l'élève</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

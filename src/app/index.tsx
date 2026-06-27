import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
    // AuthProvider will automatically handle redirection based on the user's role upon successful login
  };

  return (
    <View className="flex-1 bg-background justify-center px-8">
      <View className="items-center mb-12">
        <Text className="text-primary text-5xl font-bold tracking-tighter mb-2">SKOOL</Text>
        <Text className="text-textMuted text-lg text-center">
          Plateforme de Gestion Scolaire Nouvelle Génération
        </Text>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        {errorMsg ? (
          <Text className="text-red-500 mb-4 text-center">{errorMsg}</Text>
        ) : null}

        <View className="mb-4">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Email</Text>
          <TextInput
            className="w-full bg-background text-text border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
            placeholder="Entrez votre email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-8">
          <Text className="text-textMuted mb-2 text-sm uppercase tracking-wider font-semibold">Mot de passe</Text>
          <TextInput
            className="w-full bg-background text-text border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          onPress={handleLogin} 
          disabled={loading}
          className="w-full bg-primary rounded-xl py-4 items-center flex-row justify-center shadow-[0_0_15px_rgba(176,255,0,0.3)]"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-background font-bold text-lg">Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

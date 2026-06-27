import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import * as Location from 'expo-location';
import { MapPin, CheckCircle, LogOut, BookOpen, Users } from 'lucide-react-native';

// Coordonnées de l'école (Exemple : Cotonou)
const SCHOOL_LOCATION = {
  latitude: 6.365360,
  longitude: 2.418330,
};
const MAX_DISTANCE_METERS = 500; // 500 mètres de tolérance

// Fonction pour calculer la distance (Formule de Haversine)
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Rayon de la terre en km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance en km
  return d * 1000;
}
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function TeacherDashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'La permission de localisation est requise pour pointer.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      const distance = getDistanceFromLatLonInM(
        location.coords.latitude,
        location.coords.longitude,
        SCHOOL_LOCATION.latitude,
        SCHOOL_LOCATION.longitude
      );

      if (distance > MAX_DISTANCE_METERS) {
        Alert.alert('Échec du pointage', `Vous êtes trop loin de l'école. (${Math.round(distance)}m)`);
        setLoading(false);
        return;
      }

      // Enregistrer dans Supabase
      const { error } = await supabase.from('attendance').insert({
        user_id: user?.id,
        status: 'present',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        marked_by: user?.id
      });

      if (error) throw error;
      
      setAttendanceMarked(true);
      Alert.alert('Succès', 'Votre présence a été enregistrée avec succès !');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 mt-10">
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Enseignant</Text>
          <Text className="text-text text-2xl font-bold">Bonjour,</Text>
          <Text className="text-primary text-xl font-bold">{user?.user_metadata?.full_name || 'Professeur'}</Text>
        </View>
        <TouchableOpacity 
          onPress={signOut}
          className="bg-surface p-3 rounded-full border border-border"
        >
          <LogOut size={20} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* Pointage GPS */}
      <View className="bg-surface p-6 rounded-2xl border border-border mb-8 shadow-lg items-center">
        <View className="bg-primary/20 p-4 rounded-full mb-4">
          <MapPin size={32} color="#b0ff00" />
        </View>
        <Text className="text-text text-lg font-bold mb-2">Pointage Journalier</Text>
        <Text className="text-textMuted text-center mb-6">
          Vous devez être dans l'enceinte de l'établissement pour pointer.
        </Text>
        
        <TouchableOpacity 
          onPress={handleMarkAttendance}
          disabled={loading || attendanceMarked}
          className={`w-full py-4 rounded-xl items-center flex-row justify-center ${
            attendanceMarked 
              ? 'bg-surface border border-primary/50' 
              : 'bg-primary shadow-[0_0_15px_rgba(176,255,0,0.3)]'
          }`}
        >
          {loading ? (
            <ActivityIndicator color={attendanceMarked ? "#b0ff00" : "#000"} />
          ) : attendanceMarked ? (
            <>
              <CheckCircle size={20} color="#b0ff00" className="mr-2" />
              <Text className="text-primary font-bold text-lg">Présence Marquée</Text>
            </>
          ) : (
            <Text className="text-background font-bold text-lg">Pointer ma présence</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Menus d'action */}
      <Text className="text-text text-xl font-bold mb-4">Gestion Académique</Text>
      <View className="flex-row flex-wrap justify-between">
        <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
          <Users size={28} color="#a78bfa" className="mb-3" />
          <Text className="text-text font-bold text-center">Mes Élèves</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-surface w-[48%] p-5 rounded-2xl mb-4 border border-border items-center">
          <BookOpen size={28} color="#a78bfa" className="mb-3" />
          <Text className="text-text font-bold text-center">Saisie des Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

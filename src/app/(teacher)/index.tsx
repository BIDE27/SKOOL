import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import * as Location from 'expo-location';
import { MapPin, CheckCircle } from 'lucide-react-native';
import TabLayout from '../../components/TabLayout';

const SCHOOL_LOCATION = {
  latitude: 6.365360,
  longitude: 2.418330,
};
const MAX_DISTANCE_METERS = 500;

function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000;
}
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function TeacherDashboard() {
  const { user } = useAuth();
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
    <TabLayout role="teacher">
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">Espace Enseignant</Text>
        <Text className="text-text text-2xl font-bold">Bonjour, {user?.user_metadata?.full_name || 'Professeur'} 👋</Text>
      </View>

      {/* Pointage GPS */}
      <View className="px-6 mb-4">
        <View className="bg-surface p-5 rounded-2xl border border-border shadow-lg items-center">
          <View className="bg-primary/20 p-3 rounded-full mb-3">
            <MapPin size={24} color="#b0ff00" />
          </View>
          <Text className="text-text text-base font-bold mb-1">Pointage Journalier</Text>
          <Text className="text-textMuted text-center text-xs mb-4">
            Vous devez être dans l'enceinte pour pointer.
          </Text>
          
          <TouchableOpacity 
            onPress={handleMarkAttendance}
            disabled={loading || attendanceMarked}
            className={`w-full py-3 rounded-xl items-center flex-row justify-center ${
              attendanceMarked 
                ? 'bg-surface border border-primary/50' 
                : 'bg-primary shadow-[0_0_15px_rgba(176,255,0,0.3)]'
            }`}
          >
            {loading ? (
              <ActivityIndicator color={attendanceMarked ? "#b0ff00" : "#000"} />
            ) : attendanceMarked ? (
              <>
                <CheckCircle size={16} color="#b0ff00" className="mr-2" />
                <Text className="text-primary font-bold text-sm">Présence Marquée</Text>
              </>
            ) : (
              <Text className="text-background font-bold text-sm">Pointer ma présence</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TabLayout>
  );
}

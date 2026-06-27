import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Users } from 'lucide-react-native';

export default function StudentsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      // 1. Get teacher's class
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user?.id)
        .single();
        
      if (classError && classError.code !== 'PGRST116') throw classError;
      
      if (!classData) {
        setLoading(false);
        return; // No class assigned
      }
      
      setClassName(classData.name);

      // 2. Get enrollments and students for this class
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          student_id,
          students (
            id,
            full_name
          )
        `)
        .eq('class_id', classData.id);

      if (enrollError) throw enrollError;
      
      if (enrollments) {
        const studentList = enrollments.map(e => e.students).filter(Boolean);
        setStudents(studentList);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger la liste des élèves');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      {/* Header */}
      <View className="flex-row items-center mb-8 mt-10">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(teacher)')} className="mr-4 p-2 bg-surface rounded-full border border-border">
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <View>
          <Text className="text-textMuted text-sm font-semibold uppercase tracking-widest mb-1">
            {className ? `Classe : ${className}` : 'Mes Élèves'}
          </Text>
          <Text className="text-text text-2xl font-bold">Liste des Élèves</Text>
        </View>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
        {loading ? (
          <ActivityIndicator color="#a78bfa" size="large" />
        ) : !className ? (
          <View className="items-center py-10">
            <Users size={48} color="#64748b" className="mb-4" />
            <Text className="text-text text-lg text-center">Vous n'avez pas encore de classe assignée.</Text>
            <Text className="text-textMuted text-center mt-2">Veuillez contacter l'administration.</Text>
          </View>
        ) : students.length === 0 ? (
          <View className="items-center py-10">
            <Users size={48} color="#64748b" className="mb-4" />
            <Text className="text-text text-lg text-center">Aucun élève inscrit dans votre classe.</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {students.map((student: any) => (
              <View key={student.id} className="flex-row items-center p-4 bg-background border border-border rounded-xl">
                <View className="bg-primary/20 p-3 rounded-full mr-4">
                  <User size={20} color="#b0ff00" />
                </View>
                <View className="flex-1">
                  <Text className="text-text font-bold text-lg">{student.full_name}</Text>
                  <Text className="text-textMuted text-sm">ID: {student.id.substring(0, 8)}</Text>
                </View>
                <TouchableOpacity className="bg-surface border border-primary/50 px-4 py-2 rounded-lg">
                  <Text className="text-primary font-semibold">Noter</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

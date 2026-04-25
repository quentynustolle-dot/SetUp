import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function WorkoutPlayer({ route, navigation }) {
  // Récupération du thème ET de l'état haptique
  const { appColor, isHapticEnabled } = useTheme(); 
  const { exercises = [] } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEx = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      // Vibration conditionnelle
      if (isHapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      // Vibration finale de succès si activé
      if (isHapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      navigation.navigate('WorkoutSuccess', { exerciseCount: exercises.length });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      if (isHapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (exercises.length === 0) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER : NOM DE L'EXO */}
      <View style={styles.header}>
        <Text style={[styles.stepIndicator, { color: appColor }]}>
            EXERCICE {currentIndex + 1} SUR {exercises.length}
        </Text>
        <Text style={styles.exerciseName}>{currentEx.name.toUpperCase()}</Text>
        
        {/* Badge de muscle harmonisé avec la couleur du thème */}
        <View style={[styles.muscleBadge, { borderColor: appColor }]}>
          <Text style={[styles.muscleText, { color: appColor }]}>{currentEx.muscle.toUpperCase()}</Text>
        </View>
      </View>

      {/* ZONE CENTRALE FOCUS */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { borderLeftColor: appColor }]}>
          <Text style={[styles.descTitle, { color: appColor }]}>INSTRUCTIONS</Text>
          <Text style={styles.description}>{currentEx.description || "Effectuez le mouvement avec contrôle."}</Text>
        </View>
        
        <View style={styles.equipmentRecall}>
           <Ionicons name="construct-outline" size={20} color="#666" />
           <Text style={styles.equipmentText}>Matériel : {currentEx.equipment || "Aucun"}</Text>
        </View>
      </ScrollView>

      {/* BARRE DE PROGRESSION */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: appColor }]} />
      </View>

      {/* FOOTER NAVIGATION */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === 0 && styles.disabled]} 
          onPress={handleBack}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={28} color={currentIndex === 0 ? "#333" : "#fff"} />
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: appColor }]} 
            onPress={handleNext}
        >
          <Text style={styles.mainBtnText}>
            {currentIndex === exercises.length - 1 ? "TERMINER" : "SUIVANT"}
          </Text>
          <Ionicons name={currentIndex === exercises.length - 1 ? "checkmark-done" : "chevron-forward"} size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  header: { padding: 30, alignItems: 'center', paddingTop: 50 },
  stepIndicator: { fontWeight: 'bold', fontSize: 12, letterSpacing: 2, marginBottom: 8 },
  exerciseName: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', lineHeight: 38 },
  muscleBadge: { backgroundColor: '#1C1F26', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15, borderWidth: 1 },
  muscleText: { fontSize: 11, fontWeight: 'bold' },
  
  scrollContent: { padding: 30, paddingBottom: 100 },
  infoCard: { backgroundColor: '#1C1F26', padding: 20, borderRadius: 20, borderLeftWidth: 4 },
  descTitle: { fontWeight: 'bold', fontSize: 13, marginBottom: 10, letterSpacing: 1 },
  description: { color: '#eee', fontSize: 17, lineHeight: 26 },
  equipmentRecall: { flexDirection: 'row', alignItems: 'center', marginTop: 20, opacity: 0.6 },
  equipmentText: { color: '#fff', marginLeft: 10, fontSize: 14 },

  progressBarContainer: { height: 4, backgroundColor: '#1C1F26', width: '100%' },
  progressBarFill: { height: '100%' },

  footer: { padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F1115' },
  navBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1C1F26', justifyContent: 'center', alignItems: 'center' },
  mainBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 35, flex: 1, marginLeft: 20, justifyContent: 'center' },
  mainBtnText: { color: '#000', fontWeight: '900', marginRight: 10, fontSize: 16 },
  disabled: { opacity: 0.1 }
});
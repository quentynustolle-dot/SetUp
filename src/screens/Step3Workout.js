import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native'; 
import { EXERCISES_DB } from '../data/exercises'; 
import { useTheme } from '../context/ThemeContext';
import { getStreak } from '../utils/streakManager'; // Import de l'utilitaire
import * as Haptics from 'expo-haptics';


export default function Step3Workout({ route, navigation }) {
  const { appColor, isHapticEnabled } = useTheme(); 
  const { equipment = [], muscles = [] } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [selectedEx, setSelectedEx] = useState(null);
  const [animationSource, setAnimationSource] = useState(null);
  
  // État pour la streak dynamique
  const [streakData, setStreakData] = useState({ currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    // Chargement de l'animation Lottie
    try {
      const lottieFile = require('../../assets/animations/walker-man.json');
      setAnimationSource(lottieFile);
    } catch (e) {
      setAnimationSource(null);
    }

    // Charger la streak au montage
    const loadStreak = async () => {
      const data = await getStreak();
      setStreakData(data);
    };
    
    loadStreak();

    // Rafraîchir la streak quand on revient sur l'écran
    const unsubscribe = navigation.addListener('focus', loadStreak);
    
    const timer = setTimeout(() => setLoading(false), 2500); 
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigation]);

  const filteredExercises = EXERCISES_DB.filter(ex => 
    muscles.includes(ex.muscle) && equipment.includes(ex.equipment)
  );

  const saveWorkout = async () => {
    try {
      if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      const existingPlans = await AsyncStorage.getItem('user_plans');
      let plans = existingPlans ? JSON.parse(existingPlans) : [];
      plans.push({ id: Date.now().toString(), date: new Date().toLocaleDateString(), exercises: filteredExercises });
      await AsyncStorage.setItem('user_plans', JSON.stringify(plans));
      Alert.alert("Succès", "Séance enregistrée !");
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        {animationSource ? (
          <LottieView 
            source={animationSource} 
            autoPlay 
            loop 
            style={{ width: 150, height: 150 }} 
            colorFilters={[{ keypath: "**", color: appColor }]} 
          />
        ) : <ActivityIndicator size="large" color={appColor} />}
        <Text style={[styles.loadingText, { color: appColor }]}>Génération de l’entraînement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.mainTitle}>SÉANCE</Text>
          
          {/* STREAK DYNAMIQUE ET CLIQUABLE */}
          <TouchableOpacity 
            style={styles.streakTouch}
            onPress={() => {
              if (isHapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              navigation.navigate('StreakScreen');
            }}
          >
            <Ionicons 
              name="flame" 
              size={16} 
              color={streakData.currentStreak > 0 ? "#FF5722" : "#555"} 
            />
            <Text style={[
              styles.streakText, 
              { color: streakData.currentStreak > 0 ? "#fff" : "#555" }
            ]}>
              {streakData.currentStreak}
            </Text> 
          </TouchableOpacity>
        </View>

        <View style={styles.progressHeader}>
          <View style={styles.stepUnit}>
            <View style={[styles.checkCircle, { backgroundColor: appColor }]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={[styles.stepLabelActive, { color: appColor }]}>Matériel</Text>
          </View>
          <View style={[styles.progressLineActive, { backgroundColor: appColor }]} />
          <View style={styles.stepUnit}>
             <View style={[styles.checkCircle, { backgroundColor: appColor }]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={[styles.stepLabelActive, { color: appColor }]}>Muscles</Text>
          </View>
          <View style={[styles.progressLineActive, { backgroundColor: appColor }]} />
          <View style={styles.stepUnit}>
            <View style={[styles.stepCircleActive, { backgroundColor: appColor }]}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepLabelWhite}>Séance</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>VOTRE PROGRAMME</Text>
          <TouchableOpacity onPress={saveWorkout} style={styles.saveBtn}>
             <Ionicons name="bookmark" size={20} color={appColor} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredExercises.map((ex) => (
            <TouchableOpacity key={ex.id} style={styles.exerciseCard} onPress={() => setSelectedEx(ex)}>
              <View style={{flex: 1}}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={[styles.exMuscle, { color: appColor }]}>{ex.muscle.toUpperCase()}</Text>
              </View>
              <Ionicons name="information-circle-outline" size={22} color={appColor} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerMain, { backgroundColor: appColor }]} onPress={() => navigation.navigate('WorkoutPlayer', { exercises: filteredExercises })}>
          <Ionicons name="play" size={20} color="#000" />
          <Text style={styles.footerMainText}>DÉMARRER</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedEx} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: appColor }]}>
            <Text style={[styles.modalTitle, { color: appColor }]}>{selectedEx?.name}</Text>
            <Text style={styles.modalDesc}>{selectedEx?.description}</Text>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: appColor }]} onPress={() => setSelectedEx(null)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 40, marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  streakTouch: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  streakText: { fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#16191E', paddingVertical: 15, borderRadius: 20 },
  stepUnit: { alignItems: 'center', width: 80 },
  checkCircle: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepCircleActive: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  stepLabelActive: { fontSize: 9, fontWeight: 'bold' },
  stepLabelWhite: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  progressLineActive: { width: 30, height: 2, marginBottom: 12 },
  loaderContainer: { flex: 1, backgroundColor: '#0F1115', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#1C1F26', padding: 10, borderRadius: 12 },
  exerciseCard: { backgroundColor: '#1C1F26', padding: 18, borderRadius: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2E37' },
  exName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  exMuscle: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  footer: { paddingHorizontal: 20, paddingBottom: 30, flexDirection: 'row' },
  footerBack: { backgroundColor: '#1C1F26', width: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  footerMain: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderRadius: 20, flex: 1, marginLeft: 15, justifyContent: 'center' },
  footerMainText: { color: '#000', marginLeft: 8, fontWeight: '900', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 20, width: '85%', borderWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalDesc: { color: '#ccc', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  modalBtn: { padding: 12, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { color: '#000', fontWeight: 'bold' }
});
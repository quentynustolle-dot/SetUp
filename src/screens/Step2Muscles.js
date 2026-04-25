import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Ajout de MaterialCommunityIcons ici
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { getStreak } from '../utils/streakManager';

const MUSCLES = [
  { id: 'Pectoraux', label: 'Pectoraux', icon: 'shield-outline', family: 'Ionicons' },
  { id: 'Épaules', label: 'Épaules', icon: 'contract-outline', family: 'Ionicons' },
  { id: 'Biceps', label: 'Bras (Biceps)', icon: 'barbell-outline', family: 'Ionicons' },
  { id: 'Triceps', label: 'Bras (Triceps)', icon: 'fitness-outline', family: 'Ionicons' },
  { id: 'Abdos', label: 'Abdominaux', icon: 'grid-outline', family: 'Ionicons' },
  { id: 'Dos', label: 'Dos', icon: 'reorder-four-outline', family: 'Ionicons' },
  { id: 'Cuisses', label: 'Cuisses', icon: 'walk-outline', family: 'Ionicons' },
  { id: 'Mollets', label: 'Mollets', icon: 'footsteps-outline', family: 'Ionicons' },
];

export default function Step2Muscles({ navigation, route }) {
  const { appColor, isHapticEnabled } = useTheme(); 
  const { selectedEquipment } = route.params || { selectedEquipment: [] };
  const [selected, setSelected] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    const loadStreak = async () => {
      const data = await getStreak();
      setStreakData(data);
    };
    const unsubscribe = navigation.addListener('focus', loadStreak);
    return unsubscribe;
  }, [navigation]);

  const toggle = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (isHapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isNextDisabled = selected.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.mainTitle}>MUSCLES</Text>
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
            <View style={[styles.checkCircle, { backgroundColor: appColor }]}>
                <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={[styles.stepLabelActive, { color: appColor }]}>Matériel</Text>
          </View>
          <View style={[styles.progressLineActive, { backgroundColor: appColor }]} />
          <View style={styles.stepUnit}>
            <View style={[styles.stepCircleActive, { backgroundColor: appColor }]}>
                <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepLabelWhite}>Muscles</Text>
          </View>
          <View style={styles.progressLineEmpty} />
          <View style={styles.stepUnit}>
            <View style={styles.stepCircleEmpty}><Text style={styles.stepNumEmpty}>3</Text></View>
            <Text style={styles.stepLabelEmpty}>Séance</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Choisissez votre entraînement</Text>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {MUSCLES.map((m) => {
            const isSelected = selected.includes(m.id);
            // On définit dynamiquement le composant d'icône ici
            const IconComponent = m.family === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

            return (
              <TouchableOpacity 
                key={m.id} 
                activeOpacity={0.7}
                style={[styles.card, isSelected && { borderColor: appColor }]} 
                onPress={() => toggle(m.id)}
              >
                <View style={[styles.dot, { backgroundColor: isSelected ? appColor : '#444' }]} />
                
                {/* Utilisation du composant dynamique IconComponent */}
                <IconComponent name={m.icon} size={32} color={isSelected ? appColor : '#888'} />
                
                <Text style={[styles.cardText, isSelected && { color: appColor }]}>{m.label}</Text>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={appColor} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.footerBackText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerMain, { backgroundColor: appColor }, isNextDisabled && styles.disabled]} 
          onPress={() => {
            if (!isNextDisabled) {
              if (isHapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              navigation.navigate('Step3Workout', { equipment: selectedEquipment, muscles: selected });
            }
          }}
          disabled={isNextDisabled}
        >
          <Text style={styles.footerMainText}>Continuer ({selected.length})</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... styles inchangés ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 40, marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  streakTouch: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  streakText: { fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#16191E', paddingVertical: 15, borderRadius: 20 },
  stepUnit: { alignItems: 'center', width: 80 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepCircleActive: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepCircleEmpty: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  stepNumEmpty: { color: '#555', fontWeight: 'bold', fontSize: 12 },
  stepLabelActive: { fontSize: 9, fontWeight: 'bold' },
  stepLabelWhite: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  stepLabelEmpty: { color: '#555', fontSize: 9, fontWeight: 'bold' },
  progressLineActive: { width: 30, height: 2, marginBottom: 15 },
  progressLineEmpty: { width: 30, height: 2, backgroundColor: '#333', marginBottom: 15 },
  content: { flex: 1, paddingHorizontal: 20 },
  subtitle: { color: '#666', fontSize: 13, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  card: { width: '48%', backgroundColor: '#1C1F26', padding: 20, borderRadius: 18, marginBottom: 15, alignItems: 'center', borderWidth: 2, borderColor: '#2A2E37' },
  dot: { position: 'absolute', top: 12, left: 12, width: 6, height: 6, borderRadius: 3 },
  checkBadge: { position: 'absolute', top: 8, right: 8 },
  cardText: { color: '#888', marginTop: 12, fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between' },
  footerBack: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', paddingHorizontal: 20, borderRadius: 20 },
  footerBackText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  footerMain: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 25, borderRadius: 20, flex: 1, marginLeft: 15, justifyContent: 'center' },
  footerMainText: { color: '#000', marginRight: 8, fontWeight: '900', fontSize: 16 },
  disabled: { backgroundColor: '#1C1F26', opacity: 0.5 }
});
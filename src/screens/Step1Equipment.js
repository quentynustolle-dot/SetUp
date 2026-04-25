import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  LayoutAnimation,
  Platform,
  UIManager 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import des deux familles
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { getStreak } from '../utils/streakManager';

const EQUIPMENTS = [
  { id: '1', name: 'Poids du corps', icon: 'accessibility-outline', family: 'Ionicons' },
  { id: '2', name: 'Haltères', icon: 'barbell-outline', family: 'Ionicons' },
  { id: '3', name: 'Barre', icon: 'git-commit-outline', family: 'Ionicons' },
  { id: '4', name: 'Élastique', icon: 'infinite-outline', family: 'Ionicons' },
  { id: '5', name: 'Banc', icon: 'bench', family: 'MaterialCommunityIcons' }, 
  { id: '7', name: 'Barre traction', icon: 'reorder-two-outline', family: 'Ionicons' },
];

export default function Step1Equipment({ navigation }) {
  const { appColor, isHapticEnabled } = useTheme(); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    const loadStreak = async () => {
      const data = await getStreak();
      setStreakData(data);
    };
    const unsubscribe = navigation.addListener('focus', loadStreak);
    return unsubscribe;
  }, [navigation]);

  const toggleEquipment = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const isNextDisabled = selectedIds.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.mainTitle}>ÉQUIPEMENT</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
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
            <View style={[styles.stepCircleActive, { backgroundColor: appColor }]}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepLabelWhite}>Matériel</Text>
          </View>
          <View style={styles.progressLineEmpty} />
          <View style={styles.stepUnit}>
            <View style={styles.stepCircleEmpty}>
              <Text style={styles.stepNumEmpty}>2</Text>
            </View>
            <Text style={styles.stepLabelEmpty}>Muscles</Text>
          </View>
          <View style={styles.progressLineEmpty} />
          <View style={styles.stepUnit}>
            <View style={styles.stepCircleEmpty}>
              <Text style={styles.stepNumEmpty}>3</Text>
            </View>
            <Text style={styles.stepLabelEmpty}>Séance</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Sélectionnez votre matériel disponible</Text>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {EQUIPMENTS.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const IconComponent = item.family === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
            
            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.7}
                style={[styles.card, isSelected && { borderColor: appColor }]} 
                onPress={() => toggleEquipment(item.id)}
              >
                <View style={[styles.dot, { backgroundColor: isSelected ? appColor : '#444' }]} />
                
                {/* Rendu dynamique de l'icône selon sa famille */}
                <IconComponent 
                  name={item.icon} 
                  size={35} 
                  color={isSelected ? appColor : '#888'} 
                />

                <Text style={[styles.cardText, isSelected && { color: appColor }]}>{item.name}</Text>
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
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.footerMain, { backgroundColor: appColor }, isNextDisabled && styles.disabled]} 
          onPress={() => {
            if (!isNextDisabled) {
              if (isHapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              navigation.navigate('Step2Muscles', { selectedEquipment: selectedIds });
            }
          }}
          disabled={isNextDisabled}
        >
          <Text style={styles.footerMainText}>Continuer</Text>
          <Ionicons name="arrow-forward" size={20} color={isNextDisabled ? "#555" : "#000"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 40, marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
  streakTouch: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  streakText: { fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#16191E', paddingVertical: 15, borderRadius: 20 },
  stepUnit: { alignItems: 'center', width: 80 },
  stepCircleActive: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepCircleEmpty: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  stepNumEmpty: { color: '#555', fontWeight: 'bold', fontSize: 12 },
  stepLabelWhite: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  stepLabelEmpty: { color: '#555', fontSize: 9, fontWeight: 'bold' },
  progressLineEmpty: { width: 30, height: 2, backgroundColor: '#333', marginBottom: 15 },
  content: { flex: 1, paddingHorizontal: 20 },
  subtitle: { color: '#666', fontSize: 13, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  card: { width: '48%', backgroundColor: '#1C1F26', padding: 20, borderRadius: 18, marginBottom: 15, alignItems: 'center', borderWidth: 2, borderColor: '#2A2E37', position: 'relative' },
  dot: { position: 'absolute', top: 12, left: 12, width: 6, height: 6, borderRadius: 3 },
  checkBadge: { position: 'absolute', top: 8, right: 8 },
  cardText: { color: '#888', marginTop: 12, fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  footerMain: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderRadius: 20, justifyContent: 'center' },
  footerMainText: { color: '#000', marginRight: 8, fontWeight: '900', fontSize: 16 },
  disabled: { backgroundColor: '#1C1F26', opacity: 0.5 }
});
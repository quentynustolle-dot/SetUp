import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AJOUTÉ
import { EXERCISES_DB } from '../data/exercises'; // Import de ta base de données

const { width } = Dimensions.get('window');

// 1. MISE À JOUR DES NOMS POUR CORRESPONDRE À TA LIBRAIRIE
const MUSCLES = [
  { id: 'Pectoraux', label: 'Pectoraux', icon: 'shield-outline' },
  { id: 'Épaules', label: 'Épaules', icon: 'contract-outline' },
  { id: 'Biceps', label: 'Bras (Biceps)', icon: 'barbell-outline' },
  { id: 'Triceps', label: 'Bras (Triceps)', icon: 'fitness-outline' },
  { id: 'Abdos', label: 'Abdominaux', icon: 'grid-outline' },
  { id: 'Dos', label: 'Dos', icon: 'reorder-four-outline' },
  { id: 'Cuisses', label: 'Cuisses', icon: 'walk-outline' },
  { id: 'Mollets', label: 'Mollets', icon: 'footsteps-outline' },
];

const EQUIPMENTS = [
  { id: '1', name: 'Poids du corps', icon: 'accessibility-outline' },
  { id: '2', name: 'Haltères', icon: 'barbell-outline' },
  { id: '3', name: 'Barre', icon: 'git-commit-outline' },
  { id: '4', name: 'Élastique', icon: 'infinite-outline' },
  { id: '5', name: 'Banc', icon: 'calendar-outline' },
  { id: '7', name: 'Barre traction', icon: 'reorder-two-outline' },
];

export default function GeneratorScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);

  // 2. CHARGER TES EXERCICES PERSOS AU DÉMARRAGE
  useEffect(() => {
    const loadCustom = async () => {
      const saved = await AsyncStorage.getItem('custom_exercises');
      if (saved) setCustomExercises(JSON.parse(saved));
    };
    loadCustom();
  }, []);

  const toggle = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  // 3. LOGIQUE DE GÉNÉRATION (Version Simplifiée pour tester)
  const handleGenerate = () => {
    // On fusionne tout
    const allAvailable = [...customExercises, ...EXERCISES_DB];
    
    // On filtre par les muscles sélectionnés
    const pool = allAvailable.filter(ex => selectedMuscles.includes(ex.muscle));
    
    if (pool.length === 0) {
      Alert.alert("Oups", "Aucun exercice trouvé pour ces muscles.");
      return;
    }

    console.log("Exercices disponibles pour la séance:", pool);
    Alert.alert("Succès", `${pool.length} exercices trouvés (dont vos créations !)`);
    // Ici tu feras ta navigation vers l'écran de séance avec 'pool'
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>SetUp</Text>

        <Text style={styles.sectionTitle}>Quels muscles ?</Text>
        <View style={styles.grid}>
          {MUSCLES.map((m) => (
            <TouchableOpacity 
              key={m.id} 
              activeOpacity={0.7}
              style={[styles.muscleCard, selectedMuscles.includes(m.id) && styles.activeCard]}
              onPress={() => toggle(selectedMuscles, setSelectedMuscles, m.id)}
            >
              <View style={[styles.iconCircle, selectedMuscles.includes(m.id) && styles.activeIconCircle]}>
                <Ionicons name={m.icon} size={28} color={selectedMuscles.includes(m.id) ? '#000' : '#fff'} />
              </View>
              <Text style={[styles.cardLabel, selectedMuscles.includes(m.id) && styles.activeText]}>{m.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ton matériel</Text>
        <View style={styles.equipGrid}>
          {EQUIPMENTS.map((e) => (
            <TouchableOpacity 
              key={e} 
              activeOpacity={0.7}
              style={[styles.equipBadge, selectedEquip.includes(e) && styles.activeBadge]}
              onPress={() => toggle(selectedEquip, setSelectedEquip, e)}
            >
              <Text style={[styles.badgeText, selectedEquip.includes(e) && styles.activeTextBadge]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.generateBtn, selectedMuscles.length === 0 && styles.btnDisabled]}
          disabled={selectedMuscles.length === 0}
          onPress={handleGenerate} // AJOUTÉ
        >
          <Text style={styles.btnText}>Générer la séance</Text>
          <Ionicons name="rocket" size={22} color="#000" />
        </TouchableOpacity>
        
        <View style={{height: 100}} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' }, // Fond noir pur comme tes captures
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 42, color: '#fff', fontWeight: '900', marginTop: 20, marginBottom: 30 },
  sectionTitle: { color: '#555', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 15 },
  
  // Grille des muscles (2 colonnes)
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  muscleCard: { 
    width: (width - 55) / 2, height: 130, backgroundColor: '#161616', borderRadius: 25, 
    padding: 15, marginBottom: 15, justifyContent: 'space-between', borderWidth: 1, borderColor: '#222'
  },
  activeCard: { borderColor: '#4ADE80', backgroundColor: '#1A2E22' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  activeIconCircle: { backgroundColor: '#4ADE80' },
  cardLabel: { color: '#fff', fontSize: 18, fontWeight: '700' },
  activeText: { color: '#4ADE80' },

  // Badges matériel
  equipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  equipBadge: { 
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, 
    backgroundColor: '#161616', borderWidth: 1, borderColor: '#222' 
  },
  activeBadge: { backgroundColor: '#4ADE80', borderColor: '#4ADE80' },
  badgeText: { color: '#888', fontWeight: '700', fontSize: 14 },
  activeTextBadge: { color: '#000' },

  // Bouton de validation
  generateBtn: { 
    backgroundColor: '#4ADE80', height: 65, borderRadius: 20, marginTop: 40,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20
  },
  btnDisabled: { backgroundColor: '#1A1A1A', shadowOpacity: 0 },
  btnText: { color: '#000', fontSize: 18, fontWeight: '900' }
});
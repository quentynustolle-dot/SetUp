import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, SafeAreaView, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISES_DB } from '../data/exercises';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const MUSCLE_OPTIONS = [
  { id: 'Pectoraux', label: 'Pectoraux', icon: 'shield-outline' },
  { id: 'Épaules', label: 'Épaules', icon: 'contract-outline' },
  { id: 'Bras', label: 'Bras', icon: 'barbell-outline' },
  { id: 'Abdos', label: 'Abdominaux', icon: 'grid-outline' },
  { id: 'Dos', label: 'Dos', icon: 'reorder-four-outline' },
  { id: 'Jambes', label: 'Jambes', icon: 'walk-outline' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'Poids du corps', name: 'Poids du corps' },
  { id: 'Haltères', name: 'Haltères' },
  { id: 'Barre', name: 'Barre' },
  { id: 'Élastique', name: 'Élastique' },
  { id: 'Banc', name: 'Banc' },
  { id: 'Kettlebell', name: 'Kettlebell' },
];

export default function LibraryScreen() {
  const { appColor } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState(null);
  const [customExercises, setCustomExercises] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEx, setEditingEx] = useState(null);

  const [form, setForm] = useState({ 
    name: '', 
    muscle: MUSCLE_OPTIONS[0], 
    equipment: EQUIPMENT_OPTIONS[0], 
    description: '' 
  });

  useEffect(() => { loadCustomExercises(); }, []);

  const loadCustomExercises = async () => {
    const saved = await AsyncStorage.getItem('custom_exercises');
    if (saved) setCustomExercises(JSON.parse(saved));
  };

  const saveCustomExercises = async (newList) => {
    setCustomExercises(newList);
    await AsyncStorage.setItem('custom_exercises', JSON.stringify(newList));
  };

  const handleSaveExercise = () => {
    if (!form.name) return Alert.alert("Erreur", "Le nom est requis.");
    
    // On s'assure d'enregistrer des strings simples pour la compatibilité avec le Generator
    const exerciseToSave = {
      ...form,
      muscle: form.muscle.id, // On stocke l'ID (ex: "Pectoraux")
      equipment: form.equipment.name, // On stocke le nom (ex: "Haltères")
      isCustom: true
    };

    if (editingEx) {
      const newList = customExercises.map(ex => ex.id === editingEx.id ? { ...exerciseToSave, id: editingEx.id } : ex);
      saveCustomExercises(newList);
    } else {
      const newEx = { ...exerciseToSave, id: Date.now().toString() };
      saveCustomExercises([newEx, ...customExercises]);
    }
    closeForm();
  };

  const openEdit = (ex) => {
    setEditingEx(ex);
    // On retrouve les objets correspondants pour le formulaire
    const mObj = MUSCLE_OPTIONS.find(m => m.id === ex.muscle) || MUSCLE_OPTIONS[0];
    const eObj = EQUIPMENT_OPTIONS.find(e => e.name === ex.equipment) || EQUIPMENT_OPTIONS[0];
    
    setForm({ name: ex.name, muscle: mObj, equipment: eObj, description: ex.description });
    setIsCreateModalOpen(true);
  };

  const deleteExercise = (id) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer cet exercice ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => {
          const newList = customExercises.filter(ex => ex.id !== id);
          saveCustomExercises(newList);
          setSelectedEx(null);
      }}
    ]);
  };

  const closeForm = () => {
    setIsCreateModalOpen(false);
    setEditingEx(null);
    setForm({ name: '', muscle: MUSCLE_OPTIONS[0], equipment: EQUIPMENT_OPTIONS[0], description: '' });
  };

  const Selector = ({ label, options, current, onSelect, type }) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(opt => {
          const isSelected = type === 'muscle' ? current.id === opt.id : current.id === opt.id;
          return (
            <TouchableOpacity 
              key={opt.id} 
              onPress={() => onSelect(opt)}
              style={[styles.chip, isSelected && { backgroundColor: appColor }]}
            >
              <Text style={[styles.chipText, isSelected && { color: '#000' }]}>
                {opt.label || opt.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BIBLIOTHÈQUE</Text>

      <View style={styles.headerRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput style={styles.input} placeholder="Rechercher..." placeholderTextColor="#666" value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: appColor }]} onPress={() => setIsCreateModalOpen(true)}>
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={[...customExercises, ...EXERCISES_DB].filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseCard} onPress={() => setSelectedEx(item)}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.exName}>{item.name}</Text>
                {item.isCustom && <View style={[styles.customBadge, { backgroundColor: appColor }]}><Text style={styles.customBadgeText}>Perso</Text></View>}
              </View>
              <Text style={[styles.exMuscle, { color: appColor }]}>
                {typeof item.muscle === 'string' ? item.muscle.toUpperCase() : item.muscle?.id?.toUpperCase()} • 
                <Text style={{color: '#666'}}> {typeof item.equipment === 'string' ? item.equipment : item.equipment?.name}</Text>
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#444" />
          </TouchableOpacity>
        )}
      />

      {/* MODALE FORMULAIRE */}
      <Modal visible={isCreateModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.formContainer}>
            <Text style={styles.modalTitle}>{editingEx ? "Modifier" : "Nouvel exercice"}</Text>
            <TextInput style={styles.formInput} placeholder="Nom" placeholderTextColor="#666" value={form.name} onChangeText={(t) => setForm({...form, name: t})} />
            
            <Selector label="MUSCLE" options={MUSCLE_OPTIONS} current={form.muscle} onSelect={(val) => setForm({...form, muscle: val})} type="muscle" />
            <Selector label="MATÉRIEL" options={EQUIPMENT_OPTIONS} current={form.equipment} onSelect={(val) => setForm({...form, equipment: val})} type="equip" />

            <TextInput style={[styles.formInput, { height: 80, marginTop: 15 }]} multiline placeholder="Instructions..." placeholderTextColor="#666" value={form.description} onChangeText={(t) => setForm({...form, description: t})} />
            
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={closeForm}><Text style={{color: '#fff'}}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btnSave, { backgroundColor: appColor }]} onPress={handleSaveExercise}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODALE INFO */}
      <Modal visible={!!selectedEx} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={[styles.modalTitle, { color: appColor }]}>{selectedEx?.name}</Text>
                  <View style={styles.modalBadgeRow}>
                    <Text style={styles.modalBadge}>{typeof selectedEx?.muscle === 'string' ? selectedEx?.muscle : selectedEx?.muscle?.label}</Text>
                    <Text style={styles.modalBadge}>{typeof selectedEx?.equipment === 'string' ? selectedEx?.equipment : selectedEx?.equipment?.name}</Text>
                  </View>
                  <ScrollView style={{ maxHeight: 200, marginBottom: 20 }}><Text style={styles.modalDesc}>{selectedEx?.description || "Aucune instruction."}</Text></ScrollView>
                  <View style={styles.modalActions}>
                      {selectedEx?.isCustom && (
                        <>
                          <TouchableOpacity style={[styles.actionBtn, { borderColor: appColor }]} onPress={() => { const ex = selectedEx; setSelectedEx(null); openEdit(ex); }}>
                            <Ionicons name="pencil" size={20} color={appColor} /><Text style={[styles.actionBtnText, { color: appColor }]}>Modifier</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtn, { borderColor: '#EF4444' }]} onPress={() => deleteExercise(selectedEx.id)}>
                            <Ionicons name="trash" size={20} color="#EF4444" /><Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Supprimer</Text>
                          </TouchableOpacity>
                        </>
                      )}
                  </View>
                  <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: appColor }]} onPress={() => setSelectedEx(null)}><Text style={styles.modalBtnText}>Fermer</Text></TouchableOpacity>
              </View>
          </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 20, marginTop: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', padding: 12, borderRadius: 15, marginRight: 10 },
  input: { color: '#fff', marginLeft: 10, flex: 1 },
  addButton: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  exerciseCard: { backgroundColor: '#1C1F26', padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  exName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  customBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  customBadgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  exMuscle: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  formContainer: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 25, width: '92%' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formInput: { backgroundColor: '#0F1115', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  label: { color: '#666', fontSize: 10, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  selectorContainer: { marginBottom: 15 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: '#0F1115', marginRight: 8, borderWidth: 1, borderColor: '#333' },
  chipText: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  formButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnCancel: { padding: 15, flex: 1, alignItems: 'center' },
  btnSave: { padding: 15, flex: 1, alignItems: 'center', borderRadius: 12 },
  modalContent: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 25, width: '90%' },
  modalDesc: { color: '#ccc', fontSize: 15, lineHeight: 22, marginBottom: 25, textAlign: 'center' },
  modalBadgeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15, gap: 10 },
  modalBadge: { backgroundColor: '#0F1115', color: '#888', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, fontSize: 11, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
  actionBtnText: { fontWeight: 'bold', fontSize: 13 },
  modalCloseBtn: { padding: 15, borderRadius: 12, alignItems: 'center', width: '100%' },
  modalBtnText: { color: '#000', fontWeight: 'bold' }
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; // Import du thème global

export default function MyPlansScreen() {
  const { appColor } = useTheme(); // Récupération de la couleur
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newName, setNewName] = useState('');
  const isFocused = useIsFocused();

  const loadPlans = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem('user_plans');
      if (savedPlans !== null) {
        setPlans(JSON.parse(savedPlans).reverse());
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (isFocused) loadPlans();
  }, [isFocused]);

  const saveNewName = async () => {
    if (!newName.trim()) return;
    try {
      const updatedPlans = plans.map(p => 
        p.id === editingPlan.id ? { ...p, customName: newName } : p
      );
      setPlans(updatedPlans);
      await AsyncStorage.setItem('user_plans', JSON.stringify([...updatedPlans].reverse()));
      setEditingPlan(null);
      setNewName('');
    } catch (e) { Alert.alert("Erreur", "Impossible de renommer"); }
  };

  const deletePlan = async (id) => {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer ce plan ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
          const updatedPlans = plans.filter(p => p.id !== id);
          setPlans(updatedPlans);
          await AsyncStorage.setItem('user_plans', JSON.stringify([...updatedPlans].reverse()));
        } 
      }
    ]);
  };

  const showDefinition = (ex) => {
    Alert.alert(ex.name, ex.description || "Pas de description.", [{ text: "OK" }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: appColor }]}>MES PLANS</Text>
      </View>

      {/* MODALE : DÉTAILS SÉANCE */}
      <Modal visible={selectedPlan !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContent}>
            <Text style={[styles.modalTitle, { color: appColor }]}>
                {selectedPlan?.customName || "DÉTAILS"}
            </Text>
            <ScrollView style={{maxHeight: 400}}>
              {selectedPlan?.exercises.map((ex, index) => (
                <TouchableOpacity key={index} style={styles.exRow} onPress={() => showDefinition(ex)}>
                  <View style={{flex:1}}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={[styles.exMuscle, { color: appColor }]}>{ex.muscle?.toUpperCase()}</Text>
                  </View>
                  <Ionicons name="help-circle" size={24} color={appColor} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
                style={[styles.closeBtn, { backgroundColor: appColor }]} 
                onPress={() => setSelectedPlan(null)}
            >
              <Text style={styles.closeBtnText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODALE : RENOMMER */}
      <Modal visible={editingPlan !== null} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.editContent}>
            <Text style={[styles.modalTitle, { color: appColor }]}>NOMMER LA SÉANCE</Text>
            <TextInput 
              style={[styles.input, { borderColor: appColor }]} 
              value={newName} 
              onChangeText={setNewName} 
              placeholder="Ex: Séance Lundi..."
              placeholderTextColor="#666"
              autoFocus 
            />
            <View style={styles.row}>
                <TouchableOpacity style={[styles.miniBtn, {backgroundColor: '#333'}]} onPress={() => setEditingPlan(null)}>
                    <Text style={styles.btnText}>ANNULER</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.miniBtn, {backgroundColor: appColor}]} onPress={saveNewName}>
                    <Text style={[styles.btnText, {color: '#000'}]}>OK</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.planCard} onPress={() => setSelectedPlan(item)}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{item.customName || "Séance sans nom"}</Text>
              <Text style={styles.planDate}>{item.date} • {item.exercises?.length} exos</Text>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => {setEditingPlan(item); setNewName(item.customName || '');}} style={styles.actionIcon}>
                <Ionicons name="pencil" size={20} color={appColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletePlan(item.id)} style={styles.actionIcon}>
                <Ionicons name="trash" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900' },
  planCard: { backgroundColor: '#151515', marginHorizontal: 20, marginBottom: 12, padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' },
  planInfo: { flex: 1 },
  planName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  planDate: { color: '#666', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 15, padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  detailsContent: { backgroundColor: '#1A1A1A', width: '90%', borderRadius: 20, padding: 25, borderColor: '#333', borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  exRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: 15, backgroundColor: '#222', borderRadius: 12 },
  exName: { color: '#fff', fontWeight: 'bold' },
  exMuscle: { fontSize: 10, marginTop: 3 },
  closeBtn: { padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  closeBtnText: { fontWeight: '900', color: '#000' },
  editContent: { backgroundColor: '#1A1A1A', padding: 25, borderRadius: 20, width: '85%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  input: { backgroundColor: '#000', color: '#fff', width: '100%', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  miniBtn: { padding: 15, borderRadius: 12, width: '48%', alignItems: 'center' },
  btnText: { fontWeight: 'bold', color: '#fff' }
});
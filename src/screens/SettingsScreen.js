import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

const COLORS = ['#4ADE80', '#3B82F6', '#EF4444', '#F59E0B', '#A855F7', '#EC4899'];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen() {
  const { appColor, setAppColor, isHapticEnabled, setIsHapticEnabled } = useTheme();
  const [name, setName] = useState('Utilisateur67');
  const [goal, setGoal] = useState('Ex : Perte de poids, prise de muscle...');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const scheduleNotification = async (date) => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Active les notifications dans tes réglages.");
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "C'est l'heure du sport ! 🦾",
          body: "Ta séance personnalisée t'attend, ne lâche rien !",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: date.getHours(),
          minute: date.getMinutes(),
        },
      });

      if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert("Rappel enregistré", `Notification réglée sur ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
      
    } catch (e) {
      console.error("Erreur Notification:", e);
      Alert.alert("Erreur", "Impossible de programmer le rappel.");
    }
  };

  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
      scheduleNotification(selectedDate);
    }
  };

  const toggleHaptic = (value) => {
    setIsHapticEnabled(value);
    if (value) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PARAMÈTRES</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MON PROFIL</Text>
          <View style={styles.card}>
            <Text style={styles.label}>NOM D'UTILISATEUR</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={[styles.label, {marginTop: 15}]}>OBJECTIF PRINCIPAL</Text>
            <TextInput style={styles.input} value={goal} onChangeText={setGoal} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COULEUR DU THÈME</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity 
                key={color} 
                style={[styles.colorCircle, { backgroundColor: color }, appColor === color && styles.activeColorCircle]} 
                onPress={() => {
                  setAppColor(color);
                  if (isHapticEnabled) Haptics.selectionAsync().catch(() => {});
                }}
              >
                {appColor === color && <Ionicons name="checkmark" size={20} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RAPPEL QUOTIDIEN</Text>
          <TouchableOpacity style={styles.item} onPress={() => setShowPicker(true)}>
            <Ionicons name="time-outline" size={22} color={appColor} />
            <Text style={styles.itemText}>Heure du rappel</Text>
            <Text style={{ color: appColor, fontWeight: 'bold', fontSize: 16 }}>
                {reminderTime.getHours().toString().padStart(2, '0')}:
                {reminderTime.getMinutes().toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}
        </View>

        <View style={styles.section}>
            <View style={styles.item}>
                <MaterialCommunityIcons name="vibrate" size={22} color={appColor} />
                <Text style={styles.itemText}>Retour Haptique</Text>
                <Switch 
                    value={isHapticEnabled} 
                    onValueChange={toggleHaptic}
                    trackColor={{ false: "#333", true: appColor }}
                    thumbColor="#fff"
                />
            </View>
        </View>

        <View style={styles.footerBranding}>
          <Text style={styles.footerText}>Créé avec</Text>
          <Ionicons name="heart" size={14} color={appColor} style={{ marginHorizontal: 5 }} />
          <Text style={styles.footerText}>par <Text style={{ fontWeight: 'bold', color: '#fff' }}> Quentin</Text></Text>
          <Text style={styles.versionText}>v1.0.1</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 20, marginTop: Platform.OS === 'android' ? 40 : 10 },
  section: { marginBottom: 25 },
  sectionTitle: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  card: { backgroundColor: '#1C1F26', padding: 20, borderRadius: 20 },
  label: { color: '#444', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  input: { color: '#fff', fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 8 },
  colorGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1C1F26', padding: 15, borderRadius: 20 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  activeColorCircle: { borderWidth: 2, borderColor: '#fff' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1F26', padding: 20, borderRadius: 20 },
  itemText: { color: '#fff', flex: 1, marginLeft: 15, fontSize: 16 },
  
  // Nouveaux styles pour la signature
  footerBranding: { marginTop: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', opacity: 0.8 },
  footerText: { color: '#666', fontSize: 12 },
  versionText: { color: '#333', fontSize: 10, width: '100%', textAlign: 'center', marginTop: 8 }
});
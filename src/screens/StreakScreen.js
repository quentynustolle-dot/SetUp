import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function StreakScreen({ navigation }) {
  const { appColor } = useTheme();
  const currentStreak = 3; // À lier à ton AsyncStorage plus tard
  const maxStreak = 12;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="flame" size={100} color={appColor} />
        <Text style={styles.title}>Bravo pour ta série de {currentStreak} jours !</Text>
        
        <View style={styles.statsCard}>
          <Text style={styles.statLabel}>RECORD PERSONNEL</Text>
          <Text style={[styles.statValue, { color: appColor }]}>{maxStreak} JOURS</Text>
        </View>

        <Text style={styles.motivation}>Ne lâche rien, la régularité est la clé du succès. 🔥</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  closeBtn: { padding: 20, alignSelf: 'flex-end' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  statsCard: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 20, marginTop: 40, alignItems: 'center', width: '100%' },
  statLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  statValue: { fontSize: 40, fontWeight: '900', marginTop: 10 },
  motivation: { color: '#666', marginTop: 40, textAlign: 'center', fontSize: 16, fontStyle: 'italic' }
});
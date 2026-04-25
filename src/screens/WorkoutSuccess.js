import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext'; // Import du hook de thème

export default function WorkoutSuccess({ route, navigation }) {
  const { appColor } = useTheme(); // Récupération de la couleur globale
  const { exerciseCount = 0 } = route.params || {};

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Séance terminée ! 💪 J'ai validé ${exerciseCount} exercices sur mon app de sport. Qui veut me rejoindre ?`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Trophée avec couleur dynamique */}
        <Ionicons name="trophy" size={100} color={appColor} />
        
        <Text style={styles.title}>BIEN JOUÉ !</Text>
        <Text style={styles.subtitle}>Séance terminée avec succès.</Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            {/* Valeur statistique avec couleur dynamique */}
            <Text style={[styles.statValue, { color: appColor }]}>{exerciseCount}</Text>
            <Text style={styles.statLabel}>EXERCICES</Text>
          </View>
        </View>

        {/* BOUTON PARTAGER avec bordure et texte dynamiques */}
        <TouchableOpacity 
          style={[styles.shareBtn, { borderColor: appColor }]} 
          onPress={onShare}
        >
          <Ionicons name="share-social" size={20} color={appColor} />
          <Text style={[styles.shareBtnText, { color: appColor }]}>PARTAGER MES RÉSULTATS</Text>
        </TouchableOpacity>

        {/* BOUTON ACCUEIL avec fond dynamique */}
        <TouchableOpacity 
          style={[styles.homeBtn, { backgroundColor: appColor }]} 
          onPress={() => navigation.navigate('Mes Plans')}
        >
          <Text style={styles.homeBtnText}>RETOURNER À L'ACCUEIL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', justifyContent: 'center' },
  content: { alignItems: 'center', padding: 30 },
  title: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 20 },
  subtitle: { color: '#666', fontSize: 16, marginBottom: 40 },
  statsCard: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 24, width: '100%', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 5 },
  
  shareBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 15
  },
  shareBtnText: { fontWeight: 'bold', marginLeft: 10 },

  homeBtn: { paddingVertical: 18, borderRadius: 30, width: '100%' },
  homeBtnText: { color: '#000', fontWeight: '900', textAlign: 'center' }
});
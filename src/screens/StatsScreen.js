import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Correction Import
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { appColor } = useTheme();

  // Données simulées
  const mainStats = [
    { label: 'Séances', value: '14', icon: 'fitness' },
    { label: 'Minutes', value: '620', icon: 'time' },
    { label: 'Kcal', value: '4.2k', icon: 'flame' },
  ];

  const weeklyData = [
    { day: 'L', val: 0.4 },
    { day: 'M', val: 0.7 },
    { day: 'M', val: 0.2 },
    { day: 'J', val: 0.9 },
    { day: 'V', val: 0.5 },
    { day: 'S', val: 0.3 },
    { day: 'D', val: 0.1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>MES STATS</Text>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={30} color="#666" />
          </TouchableOpacity>
        </View>

        {/* CARTES PRINCIPALES */}
        <View style={styles.statsRow}>
          {mainStats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.iconBg, { backgroundColor: appColor + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={appColor} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* GRAPHIQUE D'ACTIVITÉ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité cette semaine</Text>
          <View style={styles.chartBox}>
            <View style={styles.barsContainer}>
              {weeklyData.map((d, i) => (
                <View key={i} style={styles.barWrapper}>
                  <View style={[
                    styles.bar, 
                    { 
                      height: d.val * 120, 
                      backgroundColor: d.val > 0.8 ? appColor : '#222' 
                    }
                  ]} />
                  <Text style={styles.dayText}>{d.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* RECORDS PERSONNELS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Records Personnels</Text>
          
          <View style={styles.recordItem}>
            <View style={styles.recordLeft}>
              <View style={styles.recordIcon}>
                <Ionicons name="barbell-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.recordName}>Développé Couché</Text>
            </View>
            <Text style={[styles.recordValue, { color: appColor }]}>92.5 kg</Text>
          </View>

          <View style={styles.recordItem}>
            <View style={styles.recordLeft}>
              <View style={styles.recordIcon}>
                <Ionicons name="walk-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.recordName}>Squat</Text>
            </View>
            <Text style={[styles.recordValue, { color: appColor }]}>115 kg</Text>
          </View>
        </View>

        {/* BADGES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges débloqués</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
            {['trophy', 'flame', 'medal', 'rocket'].map((badge, i) => (
              <View key={i} style={styles.badgeCircle}>
                <Ionicons name={badge} size={24} color={i === 0 ? '#FFD700' : '#444'} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SIGNATURE BAS DE PAGE */}
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
  container: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  title: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  profileBtn: { padding: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: '#161616', width: (width - 60) / 3, padding: 15, borderRadius: 22, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  iconBg: { padding: 8, borderRadius: 12, marginBottom: 10 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 11, fontWeight: '700', marginTop: 2 },
  section: { marginBottom: 35 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  chartBox: { backgroundColor: '#161616', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#222' },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  barWrapper: { alignItems: 'center' },
  bar: { width: 14, borderRadius: 7 },
  dayText: { color: '#444', fontSize: 12, marginTop: 12, fontWeight: 'bold' },
  recordItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161616', padding: 18, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  recordLeft: { flexDirection: 'row', alignItems: 'center' },
  recordIcon: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  recordName: { color: '#ccc', fontWeight: '600', fontSize: 15 },
  recordValue: { fontSize: 16, fontWeight: 'bold' },
  badgeScroll: { flexDirection: 'row' },
  badgeCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#222' },
  
  // Styles Signature
  footerBranding: { marginTop: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', opacity: 0.6 },
  footerText: { color: '#666', fontSize: 12 },
  versionText: { color: '#333', fontSize: 10, width: '100%', textAlign: 'center', marginTop: 5 }
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function RestTimer({ duration = 60, onFinished, appColor }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onFinished) onFinished();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const addTime = () => setTimeLeft(prev => prev + 15);

  return (
    <View style={[styles.container, { borderColor: appColor + '40' }]}>
      <Text style={styles.label}>REPOS</Text>
      <Text style={[styles.timerText, { color: appColor }]}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </Text>
      
      <View style={styles.controls}>
        <TouchableOpacity onPress={add + 15} style={styles.btnSmall}>
          <Text style={{color: '#666'}}>+15s</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleTimer} style={[styles.btnMain, { backgroundColor: appColor }]}>
          <Ionicons name={isActive ? "pause" : "play"} size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTimeLeft(0)} style={styles.btnSmall}>
          <Ionicons name="play-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1F26',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 20,
  },
  label: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  timerText: { fontSize: 48, fontWeight: '900', marginBottom: 15 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  btnMain: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnSmall: { padding: 10 },
});
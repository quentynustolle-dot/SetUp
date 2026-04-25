import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Importe tes composants de contenu (en les adaptant légèrement)
import Step1Equipment from './Step1Equipment'; 
import Step2Muscles from './Step2Muscles';
import Step3Workout from './Step3Workout';

export default function WorkoutFlow({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fonction pour changer d'étape avec effet de flou
  const nextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 400); // Temps de la transition
  };

  return (
    <View style={styles.container}>
      {/* --- ZONE FIXE (Barre de progression) --- */}
      <View style={styles.fixedProgress}>
        <MyProgressBar step={currentStep} />
      </View>

      {/* --- ZONE ANIMÉE (Le contenu qui change) --- */}
      <View style={styles.contentContainer}>
        {currentStep === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.flex1}>
            <Step1Equipment onNext={nextStep} />
          </Animated.View>
        )}
        
        {currentStep === 2 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.flex1}>
            <Step2Muscles onNext={nextStep} onBack={() => setCurrentStep(1)} />
          </Animated.View>
        )}
        
        {currentStep === 3 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.flex1}>
            <Step3Workout onNext={nextStep} onBack={() => setCurrentStep(2)} />
          </Animated.View>
        )}
      </View>

      {/* OVERLAY DE FLOU PENDANT LE CHANGEMENT */}
      {isTransitioning && (
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  fixedProgress: { height: 120, paddingTop: 40 }, // Reste immobile
  contentContainer: { flex: 1 }, // C'est ici que le "rouge" bouge
  flex1: { flex: 1 }
});
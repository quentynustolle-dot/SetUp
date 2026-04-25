import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Pour les icônes

// Import de tes écrans (on les créera au fur et à mesure)
import GeneratorScreen from '../screens/GeneratorScreen';
import MyPlansScreen from '../screens/MyPlansScreen';
import LibraryScreen from '../screens/LibraryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Style du menu du bas
        tabBarStyle: { 
          backgroundColor: '#1E1E1E', 
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10
        },
        tabBarActiveTintColor: '#4ADE80', // Vert de ton dessin
        tabBarInactiveTintColor: '#888',
        headerShown: false, // On cache le titre en haut pour garder le style épuré
      })}
    >
      <Tab.Screen 
        name="Mes Plans" 
        component={MyPlansScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Séance" 
        component={GeneratorScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={28} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Biblio" 
        component={LibraryScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="globe-outline" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
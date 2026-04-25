import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import du contexte de thème
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Imports des écrans
import Step1Equipment from './src/screens/Step1Equipment';
import Step2Muscles from './src/screens/Step2Muscles';
import Step3Workout from './src/screens/Step3Workout';
import MyPlansScreen from './src/screens/MyPlansScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import WorkoutPlayer from './src/screens/WorkoutPlayer';
import WorkoutSuccess from './src/screens/WorkoutSuccess';
import SettingsScreen from './src/screens/SettingsScreen';
import StreakScreen from './src/screens/StreakScreen';
import StatsScreen from './src/screens/StatsScreen'; // <--- NOUVEL IMPORT

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Gestion des onglets (Bottom Tabs)
function MainTabs() {
  const { appColor } = useTheme();

  return (
    <Tab.Navigator 
      initialRouteName="Séance"
      screenOptions={{
        tabBarStyle: { 
          backgroundColor: '#161616', 
          borderTopWidth: 0, 
          height: 75, 
          paddingBottom: 12
        },
        tabBarActiveTintColor: appColor,
        tabBarInactiveTintColor: '#555',
        headerShown: false,
      }}
    >
      {/* 1. ONGLET STATS (À GAUCHE) */}
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ 
          tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color}/> 
        }}
      />

      <Tab.Screen 
        name="Mes Plans" 
        component={MyPlansScreen} 
        options={{ 
          tabBarIcon: ({color}) => <Ionicons name="list" size={24} color={color}/> 
        }}
      />
      
      <Tab.Screen 
        name="Séance" 
        component={SeanceStack} 
        options={{ 
          tabBarIcon: ({color}) => <Ionicons name="add-circle" size={32} color={color}/> 
        }}
      />
      
      <Tab.Screen 
        name="Biblio" 
        component={LibraryScreen} 
        options={{ 
          tabBarIcon: ({color}) => <Ionicons name="globe-outline" size={24} color={color}/> 
        }}
      />

      <Tab.Screen 
        name="Paramètres" 
        component={SettingsScreen} 
        options={{ 
          tabBarIcon: ({color}) => <Ionicons name="settings-outline" size={24} color={color}/> 
        }}
      />
    </Tab.Navigator>
  );
}

// Stack de navigation pour la partie Workout
function SeanceStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false, 
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0F1115' } 
      }}
    >
      <Stack.Screen name="Step1Equipment" component={Step1Equipment} />
      <Stack.Screen name="Step2Muscles" component={Step2Muscles} />
      <Stack.Screen name="Step3Workout" component={Step3Workout} />
      <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayer} />
      <Stack.Screen name="WorkoutSuccess" component={WorkoutSuccess} />
      <Stack.Screen 
        name="StreakScreen" 
        component={StreakScreen} 
        options={{ animation: 'fade_from_bottom' }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}
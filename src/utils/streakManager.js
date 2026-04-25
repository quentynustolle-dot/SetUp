import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateStreak = async () => {
  try {
    const data = await AsyncStorage.getItem('streak_data');
    let { currentStreak, lastDate, bestStreak } = data ? JSON.parse(data) : { currentStreak: 0, lastDate: null, bestStreak: 0 };

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastDate === today) {
      return { currentStreak, bestStreak }; // Déjà fait aujourd'hui
    } else if (lastDate === yesterdayStr) {
      currentStreak += 1; // Série continue
    } else {
      currentStreak = 1; // Série brisée, on recommence à 1
    }

    if (currentStreak > bestStreak) bestStreak = currentStreak;

    const newData = { currentStreak, lastDate: today, bestStreak };
    await AsyncStorage.setItem('streak_data', JSON.stringify(newData));
    return newData;
  } catch (e) {
    return { currentStreak: 0, bestStreak: 0 };
  }
};

export const getStreak = async () => {
  const data = await AsyncStorage.getItem('streak_data');
  if (!data) return { currentStreak: 0, bestStreak: 0 };
  
  const parsed = JSON.parse(data);
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // Si on a raté hier et aujourd'hui, la série retombe à 0 visuellement
  if (parsed.lastDate !== today && parsed.lastDate !== yesterdayStr) {
    return { ...parsed, currentStreak: 0 };
  }
  return parsed;
};
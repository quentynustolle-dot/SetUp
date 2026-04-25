import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [appColor, setAppColor] = useState('#4ADE80');
  const [isHapticEnabled, setIsHapticEnabled] = useState(true); // État global haptique

  return (
    <ThemeContext.Provider value={{ 
      appColor, 
      setAppColor, 
      isHapticEnabled, 
      setIsHapticEnabled 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
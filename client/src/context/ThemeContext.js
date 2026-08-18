import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('themeSettings');

      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        return {
          theme: parsedSettings.theme || 'light',
          primaryColor: parsedSettings.primaryColor || '#5f27cd',
        };
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }

    return {
      theme: 'light',
      primaryColor: '#5f27cd',
    };
  });

  const getActualTheme = (theme) => {
    if (theme === 'system') {
      return window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
        ? 'dark'
        : 'light';
    }

    return theme;
  };

  const applyTheme = (theme, primaryColor) => {
    const actualTheme = getActualTheme(theme);

    // Set light or dark theme
    document.documentElement.setAttribute(
      'data-theme',
      actualTheme
    );

    // Set selected primary color
    document.documentElement.style.setProperty(
      '--primary-color',
      primaryColor || '#5f27cd'
    );

    // Add class to body
    document.body.classList.remove(
      'light-theme',
      'dark-theme'
    );

    document.body.classList.add(`${actualTheme}-theme`);
  };

  // Apply and save settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        'themeSettings',
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }

    applyTheme(
      settings.theme,
      settings.primaryColor
    );
  }, [settings]);

  // Detect system theme changes when "System" is selected
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const handleSystemThemeChange = () => {
      if (settings.theme === 'system') {
        applyTheme(
          'system',
          settings.primaryColor
        );
      }
    };

    mediaQuery.addEventListener(
      'change',
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleSystemThemeChange
      );
    };
  }, [
    settings.theme,
    settings.primaryColor,
  ]);

  const updateSetting = (key, value) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: value,
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSetting,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
};
import React, { createContext, useContext, useCallback } from 'react';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const trackEvent = useCallback((eventName, eventData = {}) => {
    console.log(`[Analytics] ${eventName}`, eventData);
    // In a real app, this would send data to Mixpanel, Google Analytics, etc.
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

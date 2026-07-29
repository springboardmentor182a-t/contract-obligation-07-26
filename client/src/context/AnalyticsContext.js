import React, { createContext, useContext } from 'react';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const logEvent = (eventName, eventData) => {
    console.log(`[Analytics Event]: ${eventName}`, eventData);
  };

  return (
    <AnalyticsContext.Provider value={{ logEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
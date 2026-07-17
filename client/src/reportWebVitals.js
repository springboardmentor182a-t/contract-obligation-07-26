<<<<<<< HEAD
const reportWebVitals = (onPerfEntry) => {
  // No-op by default. Wire up the `web-vitals` package here if you
  // later want to measure Core Web Vitals.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // intentionally left blank
=======
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
>>>>>>> e4b4e4e0c29f6c8156d879c7524be11fe270caa9
  }
};

export default reportWebVitals;

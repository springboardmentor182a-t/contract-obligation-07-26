export const loginService = async (credentials) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({ token: 'mock-jwt-token-123', user: { email: credentials.email, role: 'admin' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

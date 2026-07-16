export const signupService = async (userData) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password && userData.name) {
        resolve({ success: true, message: 'Account created successfully' });
      } else {
        reject(new Error('Missing required fields'));
      }
    }, 800);
  });
};

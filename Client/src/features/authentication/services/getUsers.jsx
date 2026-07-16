export const getUsers = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Admin User', role: 'admin' },
        { id: 2, name: 'Standard User', role: 'user' }
      ]);
    }, 500);
  });
};

import { useState } from 'react';

export const useVerifyPassword = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPassword = async (password) => {
    setIsVerifying(true);
    // Simulate verification
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsVerifying(false);
        resolve(password.length >= 8); // simple mock validation
      }, 500);
    });
  };

  return { verifyPassword, isVerifying };
};

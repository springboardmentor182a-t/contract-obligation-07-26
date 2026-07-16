import { useState } from 'react';
import { signupService } from '../services/signup';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signupService(userData);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { signup, isLoading, error };
};

import { useState } from 'react';
import { signupService } from '../services/signup';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signupService(userData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, success };
};
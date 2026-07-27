import { useState, useEffect } from 'react';

export const useVerifyPassword = (password) => {
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const checks = [];
    if (password.length < 8) checks.push('Minimum 8 characters');
    if (!/[A-Z]/.test(password)) checks.push('One uppercase letter');
    if (!/[0-9]/.test(password)) checks.push('One number');
    if (!/[!@#$%^&*]/.test(password)) checks.push('One special character');

    setFeedback(checks);
    setIsValid(checks.length === 0 && password.length > 0);
  }, [password]);

  return { isValid, feedback };
};
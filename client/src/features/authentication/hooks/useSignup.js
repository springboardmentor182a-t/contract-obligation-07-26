import { useState, useCallback } from "react";
import { signup } from "../services/signup";

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await signup(name, email, password);
      return user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the data from the URL the backend sent us
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const name = searchParams.get('name');

    if (token) {
      // 2. Save it to local storage so the app knows you are logged in
      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'Employee');
      localStorage.setItem('name', name || 'Employee');

      // 3. Send the user straight to the Employee Dashboard (Obligations)
      navigate('/obligations', { replace: true });
    } else {
      // If something went wrong, send them back to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  // Show a clean loading message while it processes (prevents the white screen)
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900">
      <div className="text-blue-400 font-semibold text-lg animate-pulse">
        Authenticating your secure workspace...
      </div>
    </div>
  );
}

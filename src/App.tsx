import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore, useAppStore } from './lib/store';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RosaryPlayer from './pages/RosaryPlayer';
import Profile from './pages/Profile';
import Prayers from './pages/Prayers';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsOnline = useAppStore((state) => state.setIsOnline);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setUser, setIsOnline]);

  return (
    <>
      <SplashScreen onComplete={() => setShowSplash(false)} />
      {!showSplash && (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/rosary" element={<ProtectedRoute><RosaryPlayer /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/prayers" element={<ProtectedRoute><Prayers /></ProtectedRoute>} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;

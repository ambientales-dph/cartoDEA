
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes
const PORTAL_LOGIN_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.minfra.gba.gob.ar/login';

export function useInactivityTimeout() {
  const auth = useAuth();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    if (!auth.currentUser) return;

    try {
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      toast({ 
        title: 'Sesión Expirada', 
        description: 'Has estado inactivo por demasiado tiempo. Redirigiendo al Portal...',
      });

      // Brief delay to allow the toast to be seen (though redirect is immediate)
      setTimeout(() => {
        window.location.href = PORTAL_LOGIN_URL;
      }, 2000);
      
    } catch (error) {
      console.error("Error during inactivity logout:", error);
      window.location.href = PORTAL_LOGIN_URL;
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => resetTimer();

    // Start timer
    resetTimer();

    events.forEach(event => window.addEventListener(event, activityHandler));

    return () => {
      events.forEach(event => window.removeEventListener(event, activityHandler));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [auth]);
}

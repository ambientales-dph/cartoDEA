
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutos
const CHECK_INTERVAL_MS = 10000; // Verificar cada 10 segundos
const PORTAL_LOGIN_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.minfra.gba.gob.ar/login';

/**
 * Hook que gestiona el cierre de sesión por inactividad.
 * Utiliza comparación de marcas de tiempo para ser robusto ante hibernación del sistema.
 */
export function useInactivityTimeout() {
  const auth = useAuth();
  const { toast } = useToast();
  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    // Si ya no hay usuario, no hacer nada
    if (!auth.currentUser) return;

    try {
      // Limpiar intervalo para evitar ejecuciones dobles
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      toast({ 
        title: 'Sesión Expirada', 
        description: 'Has estado inactivo por demasiado tiempo. Redirigiendo al Portal...',
      });

      // Breve retraso para que el usuario vea el mensaje antes del redirect
      setTimeout(() => {
        window.location.href = PORTAL_LOGIN_URL;
      }, 2500);
      
    } catch (error) {
      console.error("Error during inactivity logout:", error);
      window.location.href = PORTAL_LOGIN_URL;
    }
  };

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
  };

  useEffect(() => {
    // Definimos los eventos que se consideran "actividad"
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => resetTimer();

    // Iniciamos un chequeo periódico que sobrevive a la suspensión del equipo
    checkIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastActivityRef.current;
        
        if (elapsed > TIMEOUT_MS) {
            handleLogout();
        }
    }, CHECK_INTERVAL_MS);

    // Escuchar eventos del usuario
    events.forEach(event => window.addEventListener(event, activityHandler));

    return () => {
      // Limpieza al desmontar
      events.forEach(event => window.removeEventListener(event, activityHandler));
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [auth]);
}

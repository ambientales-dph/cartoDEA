
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

export function usePortalAuth() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitializing] = useState(true);
  const syncStartedRef = useRef(false);

  /**
   * Finaliza el proceso de inicio de sesión usando el token recibido desde el backend
   */
  const completePortalSignIn = useCallback(async (customToken: string) => {
    if (syncStartedRef.current) return;
    syncStartedRef.current = true;
    setIsSyncing(true);
    
    try {
      // Iniciar sesión nativamente en el Proyecto B
      const userCredential = await signInWithCustomToken(auth, customToken);
      const user = userCredential.user;

      toast({ 
        title: 'Sesión Sincronizada', 
        description: `Bienvenido, ${user.displayName || user.email}` 
      });

    } catch (error: any) {
      console.error("Auth completion error:", error);
      toast({ 
        title: 'Error de Autenticación', 
        description: 'No se pudo completar el inicio de sesión con el Portal DEA.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
      setIsInitializing(false);
    }
  }, [auth, toast]);

  useEffect(() => {
    // 1. Manejar modo desarrollo en localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsInitializing(false);
      return;
    }

    // 2. Recuperar el Custom Token de la cookie de intercambio
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const token = getCookie('portal_auth_token');

    if (token) {
      completePortalSignIn(token);
      // Limpiar la cookie de intercambio inmediatamente
      document.cookie = "portal_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      setIsInitializing(false);
    }
  }, [auth, completePortalSignIn]);

  return { isSyncing, isInitialized };
}

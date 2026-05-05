'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { signInWithCustomToken, updateProfile } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

export function usePortalAuth() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitializing] = useState(true);
  const syncStartedRef = useRef(false);

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  /**
   * Finaliza el proceso de inicio de sesión usando el token recibido desde el backend
   */
  const completePortalSignIn = useCallback(async (customToken: string) => {
    if (syncStartedRef.current) return;
    syncStartedRef.current = true;
    setIsSyncing(true);
    
    try {
      // 1. Iniciar sesión nativamente en el Proyecto B
      const userCredential = await signInWithCustomToken(auth, customToken);
      const user = userCredential.user;

      // 2. Recuperar metadatos de perfil de las cookies temporales
      const pictureUrl = getCookie('portal_user_picture');
      const displayName = getCookie('portal_user_name');

      // 3. Actualizar el perfil local si faltan datos (importante para el avatar en el header)
      if (user && (pictureUrl || displayName)) {
        await updateProfile(user, {
          displayName: displayName ? decodeURIComponent(displayName) : user.displayName,
          photoURL: pictureUrl ? decodeURIComponent(pictureUrl) : user.photoURL,
        });
      }

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
      // Limpiar todas las cookies de intercambio
      deleteCookie('portal_auth_token');
      deleteCookie('portal_user_picture');
      deleteCookie('portal_user_name');
      
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
    const token = getCookie('portal_auth_token');

    if (token) {
      completePortalSignIn(token);
    } else {
      setIsInitializing(false);
    }
  }, [auth, completePortalSignIn]);

  return { isSyncing, isInitialized };
}

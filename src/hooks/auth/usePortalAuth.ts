'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { signInWithCustomToken, updateProfile, signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook que gestiona la sincronización de la sesión con el Portal DEA
 * y maneja el mock user en entornos de desarrollo.
 */
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

      // 3. Actualizar el perfil local si faltan datos
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
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.cloudworkstations.dev');
    
    const token = getCookie('portal_auth_token');

    if (token) {
      completePortalSignIn(token);
    } else {
      // Si no hay token y estamos en desarrollo, logueamos un Mock User anónimo
      if (isDev && !auth.currentUser && !syncStartedRef.current) {
          console.log("usePortalAuth: Iniciando Mock User en desarrollo...");
          signInAnonymously(auth).then(async (cred) => {
              if (cred.user && !cred.user.displayName) {
                  await updateProfile(cred.user, {
                      displayName: "Agente de Desarrollo",
                      photoURL: "https://picsum.photos/seed/dev-user/200"
                  });
              }
          }).catch(err => console.error("Mock login failed:", err));
      }
      setIsInitializing(false);
    }
  }, [auth, completePortalSignIn]);

  return { isSyncing, isInitialized };
}

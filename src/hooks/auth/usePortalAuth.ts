'use client';

import { useEffect, useState, useCallback } from 'react';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const MOCK_USER = {
  uid: 'dev-user-123',
  email: 'desarrollo@cartodea.com',
  displayName: 'Agente de Desarrollo',
  photoURL: 'https://picsum.photos/seed/dev/200/200'
};

export function usePortalAuth() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const performSync = useCallback(async (token: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/auth/portal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_token: token })
      });

      if (!response.ok) throw new Error('Fallo en la sincronización con el Portal.');

      const { customToken, user } = await response.json();
      
      // Sign in locally in Project B
      await signInWithCustomToken(auth, customToken);
      
      // Store picture in local storage for quick access if needed, 
      // but Firebase Auth will handle the user object.
      localStorage.setItem('portal_user_picture', user.picture || '');

      toast({ title: 'Sesión Sincronizada', description: `Bienvenido, ${user.displayName || user.email}` });
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error: any) {
      console.error("Auth sync error:", error);
      toast({ 
        title: 'Error de Autenticación', 
        description: 'No se pudo sincronizar la sesión con el Portal DEA.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  }, [auth, toast]);

  useEffect(() => {
    // 1. Handle Localhost Mock Mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (!auth.currentUser) {
        console.log("Modo Desarrollo: Autenticando usuario de prueba...");
        // In a real scenario we might use a mock sign-in, here we just log it.
        // For the sake of the exercise, let's assume we don't block the UI.
      }
      return;
    }

    // 2. Capture token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      performSync(token);
    }
  }, [auth, performSync]);

  return { isSyncing };
}

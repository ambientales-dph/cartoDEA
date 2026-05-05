'use client';

import React, { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { usePortalAuth } from '@/hooks/auth/usePortalAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

// Se utiliza la variable de entorno para el destino de autenticación
const PORTAL_LOGIN_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.minfra.gba.gob.ar/login';

/**
 * Componente que protege las rutas privadas.
 * Verifica si hay un usuario logueado o si se está procesando un token del Portal.
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const user = useUser();
    const { isSyncing, isInitialized } = usePortalAuth();

    useEffect(() => {
        // Solo redirigir si la inicialización terminó, no hay usuario y no se está sincronizando un token
        if (!isInitialized && !isSyncing && !user) {
            const hostname = window.location.hostname;
            const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.cloudworkstations.dev');

            if (isDev) {
                console.log("AuthGuard: Entorno de desarrollo. Esperando inicio de sesión automático...");
                return;
            }
            
            // Redirigir al portal para autenticación en producción
            window.location.href = PORTAL_LOGIN_URL;
        }
    }, [user, isSyncing, isInitialized]);

    // Pantalla de carga mientras se verifica la sesión o se sincroniza el token
    // En desarrollo permitimos el render si no hay usuario aún pero estamos cargando
    if (isSyncing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium animate-pulse">Sincronizando con Portal DEA...</p>
            </div>
        );
    }

    // Permitir acceso si hay usuario
    if (user) {
        return <>{children}</>;
    }

    // En desarrollo, mostramos el contenido aunque el usuario esté cargando (para evitar flashes)
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.cloudworkstations.dev');
    
    if (isDev) {
        return <>{children}</>;
    }

    // Si no hay usuario y estamos en producción, no renderizar nada mientras se hace el redirect
    return null;
}

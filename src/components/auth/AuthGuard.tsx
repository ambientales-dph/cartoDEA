
'use client';

import React, { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { usePortalAuth } from '@/hooks/auth/usePortalAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

const PORTAL_LOGIN_URL = 'https://portal.minfra.gba.gob.ar/login';

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
            // No hay sesión en localhost? Permitir desarrollo pero avisar si es necesario
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log("AuthGuard: Modo desarrollo detectado. Se permite acceso sin sesión.");
                return;
            }
            
            // Redirigir al portal para autenticación
            window.location.href = PORTAL_LOGIN_URL;
        }
    }, [user, isSyncing, isInitialized]);

    // Pantalla de carga mientras se verifica la sesión o se sincroniza el token
    if (isInitialized || isSyncing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium animate-pulse">Verificando credenciales con Portal DEA...</p>
            </div>
        );
    }

    // Si no hay usuario y estamos en producción, no renderizar nada mientras se hace el redirect
    if (!user && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return null;
    }

    // Si hay usuario (o estamos en modo desarrollo), mostrar el contenido
    return <>{children}</>;
}

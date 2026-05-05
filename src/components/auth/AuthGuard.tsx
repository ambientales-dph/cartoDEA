'use client';

import React, { useEffect, useState } from 'react';
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
 * Utiliza un estado 'isMounted' para evitar errores de hidratación al comparar 
 * el renderizado del servidor con el del cliente.
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const user = useUser();
    const { isSyncing, isInitialized } = usePortalAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Al montar en el cliente, actualizamos el estado
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Solo realizar la lógica de redirección si estamos en el cliente (isMounted)
        // y la inicialización terminó sin encontrar sesión activa
        if (isMounted && !isInitialized && !isSyncing && !user) {
            const hostname = window.location.hostname;
            const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.cloudworkstations.dev');

            if (isDev) {
                console.log("AuthGuard: Entorno de desarrollo. Esperando inicio de sesión automático...");
                return;
            }
            
            // Redirigir al portal para autenticación en producción
            window.location.href = PORTAL_LOGIN_URL;
        }
    }, [user, isSyncing, isInitialized, isMounted]);

    // Pantalla de carga inicial (se renderiza igual en servidor y cliente para evitar desajustes de hidratación)
    if (!isMounted || isSyncing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium animate-pulse">Cargando CartoDEA...</p>
            </div>
        );
    }

    // Permitir acceso si hay usuario (ya estamos en el cliente aquí)
    if (user) {
        return <>{children}</>;
    }

    // Manejo especial para entorno de desarrollo: permitir renderizado mientras el bypass de usePortalAuth actúa
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.cloudworkstations.dev');
    
    if (isDev) {
        return <>{children}</>;
    }

    // Estado de espera final antes de la redirección en producción
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-sm font-medium animate-pulse">Verificando sesión...</p>
        </div>
    );
}

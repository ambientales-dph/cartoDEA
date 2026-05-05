export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { initAdminApp, initPortalAdminApp } from '@/firebase/admin-config';

/**
 * Endpoint de sincronización que recibe el token del Portal DEA vía POST.
 * Soporta tanto peticiones JSON como envíos de formulario (form-data).
 */
export async function POST(request: NextRequest) {
  try {
    let firebase_token: string | null = null;
    const contentType = request.headers.get('content-type') || '';

    // 1. Extraer el token del cuerpo del POST según el tipo de contenido
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      firebase_token = formData.get('firebase_token') as string;
    } else {
      const body = await request.json();
      firebase_token = body.firebase_token;
    }

    if (!firebase_token) {
      return NextResponse.json({ error: 'Token is required in request body' }, { status: 400 });
    }

    // 2. Inicializar aplicaciones de administración
    const mainApp = initAdminApp();
    const portalApp = initPortalAdminApp();

    if (!portalApp) {
      return NextResponse.json({ error: 'Portal integration not configured' }, { status: 501 });
    }

    // 3. Verificar token contra el Proyecto A (Portal)
    const decodedToken = await portalApp.auth().verifyIdToken(firebase_token);
    const { uid, email, picture, name } = decodedToken;

    // 4. Generar Custom Token para el Proyecto B (Este Proyecto)
    const customToken = await mainApp.auth().createCustomToken(uid, {
      email,
      name,
      picture,
      portal_sync: true
    });

    // 5. Preparar respuesta con redirección y cookie temporal de intercambio
    // Usamos una cookie para pasar el custom token al frontend de forma segura tras el POST
    const response = NextResponse.redirect(new URL('/', request.url));
    
    response.cookies.set('portal_auth_token', customToken, {
      path: '/',
      httpOnly: false, // Permitir que el cliente la lea para el signIn
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // Expira en 1 minuto (tiempo suficiente para el handoff)
    });

    // Almacenamos la URL de la imagen de perfil para acceso rápido
    if (picture) {
        response.cookies.set('portal_user_picture', picture, { path: '/', maxAge: 60 * 60 * 24 });
    }

    return response;

  } catch (error: any) {
    console.error('Portal sync error:', error);
    // Si hay error durante un form post, redirigir al login del portal con error
    return NextResponse.redirect(new URL('https://portal.minfra.gba.gob.ar/login?error=sync_failed', request.url));
  }
}

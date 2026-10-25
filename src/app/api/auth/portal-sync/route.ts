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

    // 1. Extraer el token y código de proyecto del cuerpo del POST
    let project_code: string | null = null;
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      firebase_token = formData.get('firebase_token') as string;
      project_code = (formData.get('project_code') as string) || null;
    } else {
      const body = await request.json();
      firebase_token = body.firebase_token;
      project_code = body.project_code || null;
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
    // Usamos la variable de entorno NEXT_PUBLIC_BASE_URL de forma absoluta para evitar desvíos
    const baseRedirect = process.env.NEXT_PUBLIC_BASE_URL || new URL('/', request.url).toString();
    const redirectUrlObj = new URL(baseRedirect);
    if (project_code) {
      redirectUrlObj.searchParams.set('project', project_code.toUpperCase().trim());
    }
    const response = NextResponse.redirect(redirectUrlObj.toString());
    
    // Cookie de token (muy corta duración)
    response.cookies.set('portal_auth_token', customToken, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
    });

    // Almacenamos el proyecto activo en cookie temporal
    if (project_code) {
      response.cookies.set('portal_active_project', project_code.toUpperCase().trim(), {
        path: '/',
        maxAge: 3600,
        sameSite: 'lax',
      });
    }

    // Almacenamos los datos de perfil para que el frontend actualice el objeto User de Firebase
    if (picture) {
        response.cookies.set('portal_user_picture', picture, { path: '/', maxAge: 120 });
    }
    if (name) {
        response.cookies.set('portal_user_name', name, { path: '/', maxAge: 120 });
    }

    return response;

  } catch (error: any) {
    console.error('Portal sync error:', error);
    // Si hay error, redirigir al login del portal con error
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.minfra.gba.gob.ar/login';
    return NextResponse.redirect(`${portalUrl}?error=sync_failed`);
  }
}

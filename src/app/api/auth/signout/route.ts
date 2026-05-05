// src/app/api/auth/signout/route.ts
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Cierra la sesión en CartoDEA y redirige al usuario de vuelta al Portal DEA.
 */
export async function GET(request: NextRequest) {
  // 1. Limpiar cookies de sesión
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('portal_auth_token');
  cookieStore.delete('portal_user_picture');

  // 2. Determinar la URL del Portal DEA para la redirección final
  // Se usa NEXT_PUBLIC_PORTAL_URL como destino de salida del ecosistema
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.minfra.gba.gob.ar';
  
  return NextResponse.redirect(portalUrl);
}

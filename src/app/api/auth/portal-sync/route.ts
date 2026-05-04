import { NextRequest, NextResponse } from 'next/server';
import { initAdminApp, initPortalAdminApp } from '@/firebase/admin-config';

export async function POST(request: NextRequest) {
  try {
    const { firebase_token } = await request.json();

    if (!firebase_token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 1. Initialize both apps
    const mainApp = initAdminApp();
    const portalApp = initPortalAdminApp();

    if (!portalApp) {
      return NextResponse.json({ error: 'Portal integration not configured' }, { status: 501 });
    }

    // 2. Verify token against Project A (Portal)
    const decodedToken = await portalApp.auth().verifyIdToken(firebase_token);
    const { uid, email, picture, name } = decodedToken;

    // 3. Generate Custom Token for Project B (Current Project) using the same UID
    const customToken = await mainApp.auth().createCustomToken(uid, {
      email,
      name,
      picture,
      portal_sync: true
    });

    return NextResponse.json({
      customToken,
      user: {
        uid,
        email,
        picture,
        displayName: name
      }
    });

  } catch (error: any) {
    console.error('Portal sync error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed', 
      details: error.message 
    }, { status: 401 });
  }
}

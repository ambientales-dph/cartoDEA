// src/app/api/auth/signout/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Clear the session cookie
  const cookieStore = await cookies();
  cookieStore.delete('session');

  // Redirect to the home page using absolute URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
  return NextResponse.redirect(new URL('/', baseUrl));
}

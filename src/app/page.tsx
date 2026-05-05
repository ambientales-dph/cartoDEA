
"use client";

import { GeoMapperClient } from '@/components/geo-mapper-client';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MainPage() {
  return (
    <AuthGuard>
      <GeoMapperClient />
    </AuthGuard>
  );
}

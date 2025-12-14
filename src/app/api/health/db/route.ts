import { NextResponse } from 'next/server';

import { getDb } from '@/lib/server/mongo';

export async function GET() {
  const db = await getDb();
  await db.command({ ping: 1 });

  return NextResponse.json({ ok: true, db: db.databaseName });
}

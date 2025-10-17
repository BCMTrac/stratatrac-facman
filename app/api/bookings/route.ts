import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'bookings.json');

export async function GET() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    const bookings = JSON.parse(data);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error reading bookings:', error);
    return NextResponse.json({ error: 'Failed to read bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookings = await request.json();
    writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    return NextResponse.json({ success: true, count: bookings.length });
  } catch (error) {
    console.error('Error saving bookings:', error);
    return NextResponse.json({ error: 'Failed to save bookings' }, { status: 500 });
  }
}

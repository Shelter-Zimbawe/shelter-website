import { NextResponse } from 'next/server';
import db from '@/lib/db';

const FIXED_PICKUP_TIME = '10:00 AM';

function isAllowedVisitDate(value: string) {
  if (!value) return false;
  const date = new Date(`${value}T12:00:00`);
  const day = date.getDay();
  return day === 2 || day === 4;
}

export async function GET() {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isAllowedVisitDate(body.preferredDate)) {
      return NextResponse.json(
        { error: 'Site visits are only available on Tuesdays and Thursdays.' },
        { status: 400 }
      );
    }

    const selectedStand = body.standId
      ? db.prepare('SELECT id, name, available FROM stands WHERE id = ?').get(body.standId) as
          | { id: number; name: string; available: number }
          | undefined
      : undefined;

    if (!selectedStand || !selectedStand.available) {
      return NextResponse.json(
        { error: 'Please select a valid stand from the available listings.' },
        { status: 400 }
      );
    }
    
    const stmt = db.prepare(`
      INSERT INTO bookings (name, email, phone, preferred_date, preferred_time, location, message, stand_id, stand_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.name,
      body.email,
      body.phone,
      body.preferredDate,
      FIXED_PICKUP_TIME,
      selectedStand.name,
      body.message || null,
      selectedStand.id,
      selectedStand.name,
      'pending'
    );

    const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

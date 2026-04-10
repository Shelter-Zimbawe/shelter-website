import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
    stmt.run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    stmt.run(body.status, params.id);

    const updatedBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(params.id);
    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

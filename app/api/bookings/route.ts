import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all bookings for the authenticated user
    const bookings = await Booking.find({ userId: session.user.id })
      .sort({ date: 1 })
      .populate('tripId', 'destination startDate endDate');

    return NextResponse.json(bookings);
    
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingData = await request.json();
    await connectDB();

    // Create new booking
    const newBooking = new Booking({
      ...bookingData,
      userId: session.user.id
    });

    const savedBooking = await newBooking.save();
    
    // Populate trip information
    await savedBooking.populate('tripId', 'destination startDate endDate');

    return NextResponse.json(savedBooking, { status: 201 });
    
  } catch (error) {
    console.error('Create booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}


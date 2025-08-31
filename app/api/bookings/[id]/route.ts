import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get specific booking for the authenticated user
    const booking = await Booking.findOne({
      _id: params.id,
      userId: session.user.id
    }).populate('tripId', 'destination startDate endDate');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
    
  } catch (error) {
    console.error('Get booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    await connectDB();

    // Update booking for the authenticated user
    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id
      },
      updates,
      { new: true }
    ).populate('tripId', 'destination startDate endDate');

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBooking);
    
  } catch (error) {
    console.error('Update booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Delete booking for the authenticated user
    const deletedBooking = await Booking.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!deletedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
    
  } catch (error) {
    console.error('Delete booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { auth } from '@/lib/auth';

// GET specific trip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await Trip.findOne({ 
      _id: params.id, 
      userId: session.user.id 
    });
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

// PUT update trip
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // First, get the current trip to check status and existing data
    const currentTrip = await Trip.findOne({ 
      _id: params.id, 
      userId: session.user.id 
    });
    
    if (!currentTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Only allow editing if trip status is 'draft'
    if (currentTrip.status !== 'draft') {
      return NextResponse.json({ 
        error: 'Only draft trips can be edited' 
      }, { status: 400 });
    }

    // Prepare update data
    let updateData = { ...body };

    // If dates are being updated, recalculate budget
    if (body.startDate || body.endDate) {
      const startDate = body.startDate ? new Date(body.startDate) : new Date(currentTrip.startDate);
      const endDate = body.endDate ? new Date(body.endDate) : new Date(currentTrip.endDate);
      
      // Validate dates
      if (startDate >= endDate) {
        return NextResponse.json({ 
          error: 'End date must be after start date' 
        }, { status: 400 });
      }

      // Calculate new trip duration
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Recalculate budget based on daily budget and new duration
      if (currentTrip.dailyBudget) {
        const newTotalBudget = currentTrip.dailyBudget * diffDays;
        updateData.budget = newTotalBudget;
      }

      updateData.startDate = startDate;
      updateData.endDate = endDate;
    }

    // Update the trip
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await Trip.findOneAndDelete({ 
      _id: params.id, 
      userId: session.user.id 
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}

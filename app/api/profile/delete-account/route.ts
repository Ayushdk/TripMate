import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Trip } from '@/models/Trip';
import { Booking } from '@/models/Booking';
import { unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;
    console.log(`Starting account deletion process for user: ${userId}`);

    // Get user info to find avatar file
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let avatarDeleted = false;

    // Delete avatar file if it exists
    if (user?.profile?.avatar && user.profile.avatar.startsWith('/uploads/avatars/')) {
      try {
        const avatarPath = join(process.cwd(), 'public', user.profile.avatar);
        if (existsSync(avatarPath)) {
          await unlink(avatarPath);
          avatarDeleted = true;
          console.log(`Deleted avatar file for user ${userId}`);
        }
      } catch (fileError) {
        console.warn(`Could not delete avatar file for user ${userId}:`, fileError);
      }
    }

    // Delete all trips associated with the user
    const tripsResult = await Trip.deleteMany({ userId });
    console.log(`Deleted ${tripsResult.deletedCount} trips for user ${userId}`);

    // Clean up trip images if they exist
    let tripImagesDeleted = 0;
    if (tripsResult.deletedCount > 0) {
      try {
        const trips = await Trip.find({ userId });
        for (const trip of trips) {
          if (trip.image && trip.image.startsWith('/uploads/')) {
            try {
              const imagePath = join(process.cwd(), 'public', trip.image);
              if (existsSync(imagePath)) {
                await unlink(imagePath);
                tripImagesDeleted++;
              }
            } catch (fileError) {
              console.warn(`Could not delete trip image: ${trip.image}`, fileError);
            }
          }
        }
        if (tripImagesDeleted > 0) {
          console.log(`Deleted ${tripImagesDeleted} trip images for user ${userId}`);
        }
      } catch (error) {
        console.warn(`Could not clean up trip images for user ${userId}:`, error);
      }
    }

    // Delete all bookings associated with the user
    const bookingsResult = await Booking.deleteMany({ userId });
    console.log(`Deleted ${bookingsResult.deletedCount} bookings for user ${userId}`);

    // Final check - ensure no other data references this user
    const remainingTrips = await Trip.countDocuments({ userId });
    const remainingBookings = await Booking.countDocuments({ userId });
    
    if (remainingTrips > 0 || remainingBookings > 0) {
      console.warn(`Warning: Found remaining data for user ${userId} - Trips: ${remainingTrips}, Bookings: ${remainingBookings}`);
    }

    // Delete the user account
    const userResult = await User.findByIdAndDelete(userId);
    
    if (!userResult) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(`Successfully completed account deletion for user: ${userId}`);

    return NextResponse.json({ 
      message: 'Account deleted successfully',
      deletedTrips: tripsResult.deletedCount,
      deletedBookings: bookingsResult.deletedCount,
      deletedTripImages: tripImagesDeleted,
      avatarDeleted
    });
    
  } catch (error) {
    console.error('Delete account API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Trip } from '@/models/Trip';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's trips for statistics
    const trips = await Trip.find({ userId: session.user.id });
    
    // Calculate statistics
    const totalTrips = trips.length;
    const upcomingTrips = trips.filter(trip => 
      new Date(trip.startDate) > new Date() && trip.status !== 'completed'
    ).length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    
    // Get unique countries visited
    const countries = new Set();
    trips.forEach(trip => {
      if (trip.destination) {
        const parts = trip.destination.split(',');
        if (parts.length > 1) {
          countries.add(parts[parts.length - 1].trim());
        } else {
          countries.add(trip.destination.trim());
        }
      }
    });
    
    const countriesVisited = countries.size;
    
    // Calculate total spent (placeholder - you can implement actual spending tracking)
    const totalSpent = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    
    // Calculate average rating (placeholder - you can implement actual ratings)
    const averageRating = 4.8;
    
    // Determine travel level based on trips and countries
    let travelLevel = 'Beginner';
    if (totalTrips >= 10 && countriesVisited >= 5) {
      travelLevel = 'Explorer';
    } else if (totalTrips >= 5 && countriesVisited >= 3) {
      travelLevel = 'Adventurer';
    } else if (totalTrips >= 2) {
      travelLevel = 'Traveler';
    }
    
    // Generate achievements based on user activity
    const achievements = [];
    if (totalTrips >= 1) achievements.push('First Trip Completed');
    if (totalTrips >= 5) achievements.push('Frequent Traveler');
    if (countriesVisited >= 3) achievements.push('Multi-Country Explorer');
    if (totalSpent >= 5000) achievements.push('Budget Master');
    if (upcomingTrips >= 2) achievements.push('Future Planner');
    if (completedTrips >= 3) achievements.push('Experience Collector');
    
    // Get user preferences
    const preferences = {
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      phone: user.profile?.phone || '',
      interests: user.profile?.interests || [],
    };

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        avatar: user.profile?.avatar,
        createdAt: user.createdAt,
      },
      stats: {
        totalTrips,
        countriesVisited,
        upcomingTrips,
        completedTrips,
        totalSpent,
        averageRating,
        travelLevel,
      },
      achievements,
      preferences,
    });
    
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Profile API: Received update request:', updates); // Debug log
    console.log('Profile API: User ID:', session.user.id); // Debug log
    
    await connectDB();

    // Update user profile
    const updateData = {
      $set: {
        'profile.bio': updates.bio,
        'profile.location': updates.location,
        'profile.phone': updates.phone,
        'profile.interests': updates.interests || [],
      }
    };
    
    console.log('Profile API: Update data:', updateData); // Debug log

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      console.error('Profile API: User not found for ID:', session.user.id); // Debug log
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Profile API: User updated successfully:', updatedUser.profile); // Debug log

    return NextResponse.json({
      bio: updatedUser.profile?.bio,
      location: updatedUser.profile?.location,
      phone: updatedUser.profile?.phone,
      interests: updatedUser.profile?.interests,
    });
    
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

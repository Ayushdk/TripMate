import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `avatar_${session.user.id}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Generate public URL
    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user's avatar in database
    await User.findByIdAndUpdate(session.user.id, {
      'profile.avatar': avatarUrl
    });

    return NextResponse.json({ 
      avatarUrl,
      message: 'Avatar uploaded successfully' 
    });

  } catch (error: any) {
    console.error('Avatar upload error:', error);
    
    if (error.name === 'MongoServerSelectionError' || error.code === 'ENOTFOUND') {
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.',
        details: 'Unable to connect to the database server.'
      }, { status: 503 });
    }
    
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({ 
        error: 'Network error. Please check your connection and try again.',
        details: 'Failed to establish connection with the database.'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: 'An unexpected error occurred while uploading the avatar.'
    }, { status: 500 });
  }
}

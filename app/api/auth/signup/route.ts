import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API: Starting user creation...');
    
    // Connect to database
    await connectDB();
    console.log('Signup API: Database connected');
    
    const body = await request.json();
    console.log('Signup API: Received data:', { email: body.email, name: body.name, hasPassword: !!body.password });
    
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      console.log('Signup API: Validation failed - missing fields');
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup API: User already exists');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Signup API: Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Signup API: Password hashed');

    // Create user
    console.log('Signup API: Creating user object...');
    const user = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    console.log('Signup API: Saving user to database...');
    const savedUser = await user.save();
    console.log('Signup API: User saved successfully with ID:', savedUser._id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup API: Error creating user:', error);
    console.error('Signup API: Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    // Provide more specific error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}

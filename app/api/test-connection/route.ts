import { NextResponse } from 'next/server';
import { connectDBFallback, testConnection } from '@/lib/mongodb-fallback';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Fallback connection method
    try {
      console.log('Testing fallback connection...');
      const fallbackResult = await testConnection();
      results.tests.push({
        method: 'fallback',
        success: fallbackResult,
        error: null
      });
    } catch (error: any) {
      results.tests.push({
        method: 'fallback',
        success: false,
        error: error.message
      });
    }

    // Test 2: Main connection method
    try {
      console.log('Testing main connection...');
      await connectDB();
      results.tests.push({
        method: 'main',
        success: true,
        error: null
      });
    } catch (error: any) {
      results.tests.push({
        method: 'main',
        success: false,
        error: error.message
      });
    }

    // Test 3: Direct mongoose connection
    try {
      console.log('Testing direct connection...');
      const mongoose = require('mongoose');
      const mongoUri = process.env.MONGODB_URI!;
      
      // Remove problematic parameters
      const cleanUri = mongoUri
        .replace(/[?&]retryWrites=[^&]*/g, '')
        .replace(/[?&]w=[^&]*/g, '')
        .replace(/[?&]appName=[^&]*/g, '')
        .replace(/[?&]$/, '');
      
      const connection = await mongoose.connect(cleanUri, {
        bufferCommands: false,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
      });
      
      const isConnected = connection.connection.readyState === 1;
      await mongoose.disconnect();
      
      results.tests.push({
        method: 'direct',
        success: isConnected,
        error: null
      });
    } catch (error: any) {
      results.tests.push({
        method: 'direct',
        success: false,
        error: error.message
      });
    }

    // Summary
    const successfulMethods = results.tests.filter(t => t.success);
    const failedMethods = results.tests.filter(t => !t.success);
    
    results.summary = {
      totalTests: results.tests.length,
      successful: successfulMethods.length,
      failed: failedMethods.length,
      workingMethod: successfulMethods.length > 0 ? successfulMethods[0].method : null
    };

    return NextResponse.json(results);
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Connection testing failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


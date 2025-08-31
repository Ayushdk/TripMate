import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI environment variable is not set',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Check if URI contains problematic characters
    const hasSSL = mongoUri.includes('ssl=true') || mongoUri.includes('tls=true');
    const hasRetryWrites = mongoUri.includes('retryWrites=true');
    
    return NextResponse.json({
      status: 'info',
      message: 'Environment check completed',
      timestamp: new Date().toISOString(),
      mongoUriLength: mongoUri.length,
      hasSSL: hasSSL,
      hasRetryWrites: hasRetryWrites,
      // Don't expose the full URI for security
      uriPreview: mongoUri.substring(0, 50) + '...'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Test endpoint failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


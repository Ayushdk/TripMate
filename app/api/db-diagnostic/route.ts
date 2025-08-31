import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI environment variable is not set'
      }, { status: 500 });
    }

    // Parse the URI to check for issues
    let parsedUri;
    try {
      parsedUri = new URL(mongoUri);
    } catch (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid MongoDB URI format',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    // Check for common issues
    const issues = [];
    const warnings = [];
    
    // Check if it's MongoDB Atlas
    if (parsedUri.hostname.includes('mongodb.net')) {
      warnings.push('This appears to be a MongoDB Atlas connection');
    }
    
    // Check for problematic query parameters
    const problematicParams = ['ssl', 'sslValidate', 'tls', 'tlsAllowInvalidCertificates', 'tlsAllowInvalidHostnames'];
    problematicParams.forEach(param => {
      if (parsedUri.searchParams.has(param)) {
        issues.push(`Query parameter '${param}' found - this may cause SSL issues`);
      }
    });
    
    // Check for retry parameters
    if (parsedUri.searchParams.has('retryWrites')) {
      warnings.push("'retryWrites' parameter found - consider removing if causing issues");
    }
    
    if (parsedUri.searchParams.has('retryReads')) {
      warnings.push("'retryReads' parameter found - consider removing if causing issues");
    }

    // Check URI length
    if (mongoUri.length > 500) {
      warnings.push('URI is very long - consider checking for unnecessary parameters');
    }

    // Create a cleaned version of the URI
    const cleanedUri = new URL(mongoUri);
    problematicParams.forEach(param => {
      cleanedUri.searchParams.delete(param);
    });
    
    // Remove retry parameters
    cleanedUri.searchParams.delete('retryWrites');
    cleanedUri.searchParams.delete('retryReads');

    return NextResponse.json({
      status: 'info',
      message: 'MongoDB URI diagnostic completed',
      timestamp: new Date().toISOString(),
      uriLength: mongoUri.length,
      hostname: parsedUri.hostname,
      database: parsedUri.pathname.slice(1), // Remove leading slash
      hasSSLParams: problematicParams.some(param => parsedUri.searchParams.has(param)),
      hasRetryParams: parsedUri.searchParams.has('retryWrites') || parsedUri.searchParams.has('retryReads'),
      issues,
      warnings,
      cleanedUri: cleanedUri.toString(),
      recommendations: [
        'If using MongoDB Atlas, ensure your IP is whitelisted',
        'Check if your MongoDB Atlas cluster is running',
        'Verify your username and password are correct',
        'Consider removing SSL-related query parameters if causing issues'
      ]
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Diagnostic failed',
      error: error.message
    }, { status: 500 });
  }
}


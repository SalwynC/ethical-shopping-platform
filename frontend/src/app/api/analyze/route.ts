import { NextRequest, NextResponse } from 'next/server';

// Force dynamic API with real-time processing
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(` Forwarding analysis request to backend: ${url}`);

    // Call the real backend on port 4000
    const backendResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(` Backend error: ${errorText}`);
      throw new Error(`Backend returned ${backendResponse.status}`);
    }

    const backendData = await backendResponse.json();
    const processingTime = Date.now() - startTime;

    console.log(` Analysis completed in ${processingTime}ms`);

    // Return backend response with additional metadata
    return NextResponse.json({
      ...backendData,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`,
        freshData: true,
        serverTime: new Date().toLocaleTimeString(),
      }
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('Analysis error:', error);
    
    return NextResponse.json({
      error: 'Analysis failed',
      message: error.message || 'Could not analyze product',
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic for real-time tracking
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface AnalysisRequest {
  action: 'track_analysis';
  productData: {
    url: string;
    title?: string;
    category?: string;
    price?: string;
    source?: 'manual' | 'auto' | 'bulk';
  };
  analysisResults?: {
    ethicalScore?: number;
    environmentalImpact?: string;
    laborPractices?: string;
    alternatives?: number;
  };
}

interface AnalysisLog {
  id: string;
  timestamp: string;
  productUrl: string;
  productTitle: string;
  category: string;
  ethicalScore?: number;
  processingTime: number;
  userAgent: string;
  sessionId: string;
}

// In-memory storage for analysis logs (in production, use database)
let analysisLogs: AnalysisLog[] = [];
let totalAnalysesCount = 0;

// Track real product analysis
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const body: AnalysisRequest = await request.json();
    
    if (body.action === 'track_analysis') {
      // Generate unique analysis ID
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Extract session info
      const sessionId = request.headers.get('x-session-id') || 'anonymous';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      // Create analysis log entry
      const analysisLog: AnalysisLog = {
        id: analysisId,
        timestamp: new Date().toISOString(),
        productUrl: body.productData.url,
        productTitle: body.productData.title || 'Unknown Product',
        category: body.productData.category || 'general',
        ethicalScore: body.analysisResults?.ethicalScore,
        processingTime: Math.round(performance.now() - startTime),
        userAgent,
        sessionId
      };
      
      // Store the analysis log
      analysisLogs.push(analysisLog);
      totalAnalysesCount++;
      
      // Keep only last 1000 analyses in memory
      if (analysisLogs.length > 1000) {
        analysisLogs = analysisLogs.slice(-1000);
      }
      
      // Record in the main analytics system
      const analyticsResponse = await fetch(`${request.nextUrl.origin}/api/system-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'record_analysis' })
      });
      
      console.log(`🎯 REAL ANALYSIS TRACKED:`, {
        analysisId,
        productUrl: body.productData.url,
        productTitle: body.productData.title,
        category: body.productData.category,
        ethicalScore: body.analysisResults?.ethicalScore,
        processingTime: analysisLog.processingTime + 'ms',
        totalAnalyses: totalAnalysesCount,
        timestamp: new Date().toLocaleTimeString()
      });
      
      return NextResponse.json({
        success: true,
        message: 'Product analysis tracked successfully',
        data: {
          analysisId,
          totalAnalyses: totalAnalysesCount,
          timestamp: analysisLog.timestamp,
          processingTime: analysisLog.processingTime
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use "track_analysis"' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('❌ Failed to track analysis:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track product analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get analysis statistics and recent analyses
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    
    // Filter analyses by category if specified
    let filteredAnalyses = analysisLogs;
    if (category) {
      filteredAnalyses = analysisLogs.filter(analysis => 
        analysis.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Get recent analyses (limited)
    const recentAnalyses = filteredAnalyses
      .slice(-limit)
      .reverse() // Most recent first
      .map(analysis => ({
        id: analysis.id,
        timestamp: analysis.timestamp,
        productTitle: analysis.productTitle,
        category: analysis.category,
        ethicalScore: analysis.ethicalScore,
        processingTime: analysis.processingTime
      }));
    
    // Calculate statistics
    const stats = {
      totalAnalyses: totalAnalysesCount,
      analysesToday: analysisLogs.filter(analysis => 
        new Date(analysis.timestamp).toDateString() === new Date().toDateString()
      ).length,
      averageProcessingTime: analysisLogs.length > 0 
        ? Math.round(analysisLogs.reduce((sum, a) => sum + a.processingTime, 0) / analysisLogs.length)
        : 0,
      categoriesAnalyzed: Array.from(new Set(analysisLogs.map(a => a.category))).length,
      averageEthicalScore: analysisLogs.filter(a => a.ethicalScore !== undefined).length > 0
        ? Math.round(
            analysisLogs
              .filter(a => a.ethicalScore !== undefined)
              .reduce((sum, a) => sum + (a.ethicalScore || 0), 0) /
            analysisLogs.filter(a => a.ethicalScore !== undefined).length
          )
        : null
    };
    
    return NextResponse.json({
      success: true,
      data: {
        statistics: stats,
        recentAnalyses,
        totalRecords: filteredAnalyses.length
      },
      meta: {
        timestamp: new Date().toISOString(),
        dataSource: 'real-analysis-tracking'
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to get analysis data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve analysis data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
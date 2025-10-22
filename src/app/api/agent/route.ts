import { NextRequest, NextResponse } from 'next/server';
import { Agent } from '@/lib/agent';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const agent = new Agent();
    const response = await agent.processMessage(message, history || []);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

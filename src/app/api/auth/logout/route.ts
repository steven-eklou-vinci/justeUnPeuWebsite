import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    logger.info('Logout request');

    const response = NextResponse.json({
      success: true,
      message: 'Déconnecté avec succès'
    });

    // Clear the auth token cookie
    response.cookies.delete('auth-token');

    return response;

  } catch (error) {
    logger.error({ error }, 'Logout API error');
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la déconnexion'
    }, { status: 500 });
  }
}
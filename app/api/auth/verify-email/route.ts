import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { verifyUserEmail } from '@/lib/database';
import { sendEmail, createWelcomeTemplate } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.type !== 'email-verification') {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Verify the email in database
    const success = await verifyUserEmail(decoded.email);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Email verification failed. User not found.' },
        { status: 404 }
      );
    }

    // Send welcome email
    try {
      const welcomeTemplate = createWelcomeTemplate(
        decoded.email,
        'User', // In a real app, you'd get the name from the database
        'child' // In a real app, you'd get the role from the database
      );
      await sendEmail(welcomeTemplate);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if welcome email fails
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/auth/email-verified', request.nextUrl.origin)
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePasswordResetToken,
  sanitizeInput,
  validateEmail
} from '@/lib/auth';
import { 
  findUserByEmail, 
  setPasswordResetToken 
} from '@/lib/database';
import { 
  sendEmail, 
  createPasswordResetTemplate 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize input
    const email = sanitizeInput(body.email || '').toLowerCase();

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);
    
    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate password reset token
      const resetToken = generatePasswordResetToken(email);
      
      // Store reset token in database
      await setPasswordResetToken(email, resetToken);
      
      // Send password reset email
      try {
        const emailTemplate = createPasswordResetTemplate(
          email,
          resetToken,
          user.name
        );
        await sendEmail(emailTemplate);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return NextResponse.json(
          { message: 'Failed to send password reset email. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'If an account with that email exists, we have sent a password reset link.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyToken,
  validatePassword,
  hashPassword,
  sanitizeInput
} from '@/lib/auth';
import { resetUserPassword } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize inputs
    const {
      token,
      password,
      confirmPassword
    } = {
      token: sanitizeInput(body.token || ''),
      password: body.password || '',
      confirmPassword: body.confirmPassword || ''
    };

    // Validate inputs
    if (!token) {
      return NextResponse.json(
        { message: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Password and confirmation are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          message: 'Password does not meet requirements',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Verify the reset token
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.type !== 'password-reset') {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Reset the password in database
    const success = await resetUserPassword(decoded.email, hashedPassword);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Password reset failed. User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Password has been reset successfully. You can now sign in with your new password.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
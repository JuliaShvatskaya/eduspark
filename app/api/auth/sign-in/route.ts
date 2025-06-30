import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyPassword, 
  generateTokens, 
  sanitizeInput,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
} from '@/lib/auth';
import { 
  findUserByEmailOrUsername, 
  updateUserLastLogin 
} from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const body = await request.json();
    
    const {
      emailOrUsername,
      password,
      rememberMe
    } = {
      emailOrUsername: sanitizeInput(body.emailOrUsername || ''),
      password: body.password || '',
      rememberMe: body.rememberMe || false
    };

    // Basic validation
    if (!emailOrUsername.trim()) {
      return NextResponse.json({ message: 'Email or username is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    // Rate limiting
    const rateLimitKey = `${clientIP}-${emailOrUsername}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json({
        message: `Too many failed attempts. Please try again in ${Math.ceil((rateLimit.remainingTime || 0) / 60000)} minutes.`
      }, { status: 429 });
    }

    // Find user
    const user = await findUserByEmailOrUsername(emailOrUsername);

    if (!user) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ message: 'Invalid email/username or password' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ message: 'Invalid email/username or password' }, { status: 401 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json({ message: 'Please verify your email address before signing in' }, { status: 403 });
    }

    clearFailedAttempts(rateLimitKey);
    const tokens = generateTokens(user);
    await updateUserLastLogin(user.id);

    // Create response
    const response = NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        age: user.age,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: new Date()
      }
    });

    // Set cookies
    const isProd = process.env.NODE_ENV === 'production';
    const refreshMaxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day

    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: refreshMaxAge,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

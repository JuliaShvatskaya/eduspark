import { NextRequest, NextResponse } from 'next/server';
import { 
  validatePassword, 
  validateEmail, 
  validateUsername, 
  hashPassword, 
  generateEmailVerificationToken,
  sanitizeInput,
  generateCSRFToken
} from '@/lib/auth';
import { 
  createUser, 
  checkEmailExists, 
  checkUsernameExists 
} from '@/lib/database';
import { 
  sendEmail, 
  createEmailVerificationTemplate 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize inputs
    const {
      username,
      email,
      password,
      confirmPassword,
      name,
      age,
      role
    } = {
      username: sanitizeInput(body.username || ''),
      email: sanitizeInput(body.email || ''),
      password: body.password || '',
      confirmPassword: body.confirmPassword || '',
      name: sanitizeInput(body.name || ''),
      age: body.age,
      role: body.role || 'child'
    };

    // Validation
    const errors: any = {};

    // Username validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.errors;
    }

    // Email validation
    if (!validateEmail(email)) {
      errors.email = ['Please enter a valid email address'];
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }

    // Name validation
    if (!name.trim() || name.trim().length < 2) {
      errors.name = ['Name must be at least 2 characters long'];
    }

    // Age validation for children
    if (role === 'child') {
      if (!age || age < 3 || age > 18) {
        errors.age = ['Age must be between 3 and 18 for child accounts'];
      }
    }

    // Role validation
    if (!['child', 'parent', 'teacher'].includes(role)) {
      errors.role = ['Invalid role selected'];
    }

    // Check for existing email
    if (await checkEmailExists(email)) {
      errors.email = ['An account with this email already exists'];
    }

    // Check for existing username
    if (await checkUsernameExists(username)) {
      errors.username = ['This username is already taken'];
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken(email);

    // Create user
    const user = await createUser({
      username,
      email,
      password: confirmPassword, // This won't be used, just for interface compliance
      confirmPassword,
      name,
      age: role === 'child' ? age : undefined,
      role,
      hashedPassword,
      emailVerificationToken
    });

    // Send verification email
    try {
      const emailTemplate = createEmailVerificationTemplate(
        email,
        emailVerificationToken,
        name
      );
      await sendEmail(emailTemplate);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration if email fails
    }

    // Generate CSRF token for the response
    const csrfToken = generateCSRFToken();

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        csrfToken
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
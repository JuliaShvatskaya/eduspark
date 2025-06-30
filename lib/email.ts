// Email service for sending verification and password reset emails
// In production, integrate with services like SendGrid, AWS SES, or Nodemailer

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const sendEmail = async (template: EmailTemplate): Promise<boolean> => {
  // Mock email sending - in production, implement actual email service
  console.log('📧 Email sent:', {
    to: template.to,
    subject: template.subject,
    preview: template.text.substring(0, 100) + '...'
  });
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

export const createEmailVerificationTemplate = (
  email: string,
  verificationToken: string,
  name: string
): EmailTemplate => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
  
  return {
    to: email,
    subject: 'Welcome to EduSpark - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - EduSpark</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to EduSpark!</h1>
              <p>Your learning adventure is about to begin</p>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Thank you for joining EduSpark, the interactive learning platform designed to make education fun and engaging for children.</p>
              
              <p>To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${verificationUrl}
              </p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>🎮 Access interactive learning games</li>
                <li>📊 Track learning progress</li>
                <li>🏆 Earn achievements and rewards</li>
                <li>👨‍👩‍👧‍👦 Connect with family members</li>
              </ul>
              
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 EduSpark. All rights reserved.</p>
              <p>Making learning an adventure, one step at a time.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to EduSpark!
      
      Hi ${name}!
      
      Thank you for joining EduSpark. To get started, please verify your email address by visiting:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create this account, please ignore this email.
      
      © 2024 EduSpark
    `
  };
};

export const createPasswordResetTemplate = (
  email: string,
  resetToken: string,
  name: string
): EmailTemplate => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  return {
    to: email,
    subject: 'Reset Your EduSpark Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - EduSpark</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #EF4444, #F97316); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>EduSpark Account Security</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>We received a request to reset the password for your EduSpark account.</p>
              
              <p>If you requested this password reset, click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <p><strong>⚠️ Important Security Information:</strong></p>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>You can only use this link once</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your current password remains unchanged until you complete the reset</li>
                </ul>
              </div>
              
              <p>For security reasons, if you continue to receive these emails without requesting them, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 EduSpark. All rights reserved.</p>
              <p>Keep your account secure and your learning journey safe.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request - EduSpark
      
      Hi ${name}!
      
      We received a request to reset the password for your EduSpark account.
      
      If you requested this password reset, visit this link to create a new password:
      
      ${resetUrl}
      
      This link will expire in 1 hour and can only be used once.
      
      If you didn't request this reset, please ignore this email. Your current password remains unchanged.
      
      © 2024 EduSpark
    `
  };
};

export const createWelcomeTemplate = (
  email: string,
  name: string,
  role: string
): EmailTemplate => {
  return {
    to: email,
    subject: 'Welcome to EduSpark - Let\'s Start Learning!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to EduSpark</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #3B82F6; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to EduSpark!</h1>
              <p>Your learning adventure starts now</p>
            </div>
            <div class="content">
              <h2>Hi ${name}! 🌟</h2>
              <p>Congratulations! Your email has been verified and your EduSpark account is now active.</p>
              
              ${role === 'child' ? `
                <p>Get ready for an amazing learning journey filled with:</p>
                <div class="feature">
                  <h3>🎮 Interactive Games</h3>
                  <p>Learn reading, math, and thinking skills through fun games and activities.</p>
                </div>
                <div class="feature">
                  <h3>🏆 Achievements & Rewards</h3>
                  <p>Earn points, unlock achievements, and collect cool avatars as you learn.</p>
                </div>
                <div class="feature">
                  <h3>📊 Progress Tracking</h3>
                  <p>See how much you've learned and celebrate your improvements.</p>
                </div>
              ` : `
                <p>As a ${role}, you now have access to:</p>
                <div class="feature">
                  <h3>📊 Progress Dashboard</h3>
                  <p>Monitor learning progress with detailed analytics and insights.</p>
                </div>
                <div class="feature">
                  <h3>🎯 Goal Setting</h3>
                  <p>Set learning objectives and track achievement milestones.</p>
                </div>
                <div class="feature">
                  <h3>👨‍👩‍👧‍👦 Family Connection</h3>
                  <p>Connect with family members and support the learning journey together.</p>
                </div>
              `}
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/sign-in" 
                   style="display: inline-block; background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Start Learning Now! 🚀
                </a>
              </p>
              
              <p>Need help getting started? Check out our <a href="#">Quick Start Guide</a> or contact our friendly support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 EduSpark. All rights reserved.</p>
              <p>Making learning an adventure, one step at a time.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to EduSpark!
      
      Hi ${name}!
      
      Congratulations! Your email has been verified and your EduSpark account is now active.
      
      Start your learning journey at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/sign-in
      
      © 2024 EduSpark
    `
  };
};
// Mock database implementation
// In production, replace with your actual database (PostgreSQL, MongoDB, etc.)

import { User, SignUpData } from './auth';

// Mock user storage
const users = new Map<string, User & { password: string; emailVerificationToken?: string; passwordResetToken?: string }>();
const usersByEmail = new Map<string, string>(); // email -> userId
const usersByUsername = new Map<string, string>(); // username -> userId

// Generate unique ID
const generateId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Flag to track if demo users have been initialized
let demoUsersInitialized = false;
export const createUser = async (userData: SignUpData & { hashedPassword: string; emailVerificationToken: string }): Promise<User> => {
  const userId = generateId();
  
  const user: User & { password: string; emailVerificationToken: string } = {
    id: userId,
    email: userData.email,
    username: userData.username,
    name: userData.name,
    age: userData.age,
    avatar: getRandomAvatar(),
    isEmailVerified: false,
    createdAt: new Date(),
    role: userData.role,
    password: userData.hashedPassword,
    emailVerificationToken: userData.emailVerificationToken
  };
  
  users.set(userId, user);
  usersByEmail.set(userData.email.toLowerCase(), userId);
  usersByUsername.set(userData.username.toLowerCase(), userId);
  
  // Return user without password
  const { password, emailVerificationToken, ...publicUser } = user;
  return publicUser;
};

export const findUserByEmail = async (email: string): Promise<(User & { password: string }) | null> => {
  // Initialize demo users on first access if not already done
  if (!demoUsersInitialized) {
    await initializeDemoUsers();
  }
  
  const userId = usersByEmail.get(email.toLowerCase());
  if (!userId) return null;
  
  const user = users.get(userId);
  return user || null;
};

export const findUserByUsername = async (username: string): Promise<(User & { password: string }) | null> => {
  // Initialize demo users on first access if not already done
  if (!demoUsersInitialized) {
    await initializeDemoUsers();
  }
  
  const userId = usersByUsername.get(username.toLowerCase());
  if (!userId) return null;
  
  const user = users.get(userId);
  return user || null;
};

export const findUserByEmailOrUsername = async (identifier: string): Promise<(User & { password: string }) | null> => {
  // Initialize demo users on first access if not already done
  if (!demoUsersInitialized) {
    await initializeDemoUsers();
  }
  
  // Try email first
  let user = await findUserByEmail(identifier);
  if (user) return user;
  
  // Try username
  user = await findUserByUsername(identifier);
  return user;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const user = users.get(id);
  if (!user) return null;
  
  const { password, emailVerificationToken, passwordResetToken, ...publicUser } = user;
  return publicUser;
};

export const updateUserLastLogin = async (userId: string): Promise<void> => {
  const user = users.get(userId);
  if (user) {
    user.lastLogin = new Date();
  }
};

export const verifyUserEmail = async (email: string): Promise<boolean> => {
  const userId = usersByEmail.get(email.toLowerCase());
  if (!userId) return false;
  
  const user = users.get(userId);
  if (user) {
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    return true;
  }
  
  return false;
};

export const setPasswordResetToken = async (email: string, token: string): Promise<boolean> => {
  const userId = usersByEmail.get(email.toLowerCase());
  if (!userId) return false;
  
  const user = users.get(userId);
  if (user) {
    user.passwordResetToken = token;
    return true;
  }
  
  return false;
};

export const resetUserPassword = async (email: string, newHashedPassword: string): Promise<boolean> => {
  const userId = usersByEmail.get(email.toLowerCase());
  if (!userId) return false;
  
  const user = users.get(userId);
  if (user) {
    user.password = newHashedPassword;
    user.passwordResetToken = undefined;
    return true;
  }
  
  return false;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  return usersByEmail.has(email.toLowerCase());
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
  return usersByUsername.has(username.toLowerCase());
};

// Helper function to get random avatar
const getRandomAvatar = (): string => {
  const avatars = ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐰', '🐸', '🐵', '🦉'];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Initialize with demo users
export const initializeDemoUsers = async () => {
  // Prevent multiple initializations
  if (demoUsersInitialized) {
    return;
  }
  
  demoUsersInitialized = true;
  
  const demoUsers = [
    {
      username: 'alex_learner',
      email: 'alex@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      name: 'Alex',
      age: 7,
      role: 'child' as const
    },
    {
      username: 'parent_demo',
      email: 'parent@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      name: 'Parent Demo',
      role: 'parent' as const
    }
  ];

  for (const userData of demoUsers) {
    if (!await checkEmailExists(userData.email)) {
      // Import auth functions dynamically to avoid circular dependencies
      const authModule = await import('./auth');
      const hashedPassword = await authModule.hashPassword(userData.password);
      const emailVerificationToken = authModule.generateEmailVerificationToken(userData.email);
      await createUser({
        ...userData,
        hashedPassword,
        emailVerificationToken
      });
      
      // Auto-verify demo users
      await verifyUserEmail(userData.email);
    }
  }
};

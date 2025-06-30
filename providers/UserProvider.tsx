'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  age: number;
  level: number;
  points: number;
  avatar: string;
  achievements: string[];
  parentMode: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchToParentMode: () => void;
  switchToChildMode: () => void;
  addPoints: (points: number) => void;
  addAchievement: (achievement: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize with default user for demo
    const defaultUser: User = {
      id: '1',
      name: 'Alex',
      age: 7,
      level: 3,
      points: 245,
      avatar: '🦁',
      achievements: ['First Steps', 'Reading Star', 'Memory Master'],
      parentMode: false,
    };
    setUser(defaultUser);
  }, []);

  const switchToParentMode = () => {
    if (user) {
      setUser({ ...user, parentMode: true });
    }
  };

  const switchToChildMode = () => {
    if (user) {
      setUser({ ...user, parentMode: false });
    }
  };

  const addPoints = (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      setUser({ ...user, points: newPoints, level: Math.max(user.level, newLevel) });
    }
  };

  const addAchievement = (achievement: string) => {
    if (user && !user.achievements.includes(achievement)) {
      setUser({ ...user, achievements: [...user.achievements, achievement] });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      switchToParentMode,
      switchToChildMode,
      addPoints,
      addAchievement,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
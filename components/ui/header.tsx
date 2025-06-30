'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
  children?: React.ReactNode;
}

export function Header({ title = "EduSpark", showNavigation = true, children }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showNavigation && (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Image 
                  src="/eduspark-logo.png" 
                  alt="EduSpark Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
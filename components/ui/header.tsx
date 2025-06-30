'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  showNavigation?: boolean;
}

export function Header({ title, children, showNavigation = true }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {title && (
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            )}
            {showNavigation && (
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/child-dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/modules/reading" className="text-gray-600 hover:text-gray-900">
                  Reading
                </Link>
                <Link href="/modules/attention" className="text-gray-600 hover:text-gray-900">
                  Attention
                </Link>
                <Link href="/modules/speed-reading" className="text-gray-600 hover:text-gray-900">
                  Speed Reading
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {children}
            <div className="relative w-8 h-8">
              <Image 
                src="/black_circle_360x360.png" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
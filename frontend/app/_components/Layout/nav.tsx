'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const session=useSession();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Survey</span>
          </Link>
            {
              session.data?.user?(   <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button
                variant={isActive('/') && pathname === '/' ? 'default' : 'ghost'}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/create">
              <Button
                variant={isActive('/create') ? 'default' : 'ghost'}
                size="sm"
              >
                Create
              </Button>
            </Link>
            <Link href="/my-surveys">
              <Button
                variant={isActive('/my-surveys') ? 'default' : 'ghost'}
                size="sm"
              >
                My Surveys
              </Button>
            </Link>
          </div>):(<div>
            <Link href="/signin">
              <Button
                variant={isActive('/sign-in') ? 'default' : 'ghost'}
                size="sm"
                className='bg-black text-white py-1'
              >
                Sign In
              </Button>
            </Link>
              </div>)
            }
          {/* Navigation Links */}

        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const session = useSession();
  // const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-50 shadow-sm pt-1 ring-1 ring-black/10 font-serif">
      {
        session.data?.user?(<div>
          <Button className='px-2 py-1 rounded-sm bg-white text-blue-400'>Create</Button>
        </div>):(<div className='flex justify-end'>
          <Button className="my-2 text-center mr-3 underline text-xl ">Join Now</Button>
        </div>)
      }
    </nav>
  );
}

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuIcon } from '@heroicons/react/outline';
import { CogIcon } from '@heroicons/react/outline';
import logo from 'images/logo.svg';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-screen bg-zinc-800 text-white'>
      <header className='sticky top-0 left-0 right-0 flex justify-between items-center p-2 bg-gray-800'>
        <button aria-label='Show menu'>
          <MenuIcon className='h-7 w-7 text-gray-300' />
        </button>
        <Link href='/' passHref>
          <a className='flex items-center gap-3'>
            <Image
              src={logo}
              alt='Mental Math Trainer logo'
              width={32}
              height={32}
            />
            <div className='hidden sm:block text-xl'>Mental Math Trainer</div>
          </a>
        </Link>
        <button aria-label='Show settings'>
          <CogIcon className='h-7 w-7 text-gray-300' />
        </button>
      </header>
      <div className='max-w-screen-md mx-auto mt-2 p-3'>{children}</div>
    </div>
  );
};

export default Layout;

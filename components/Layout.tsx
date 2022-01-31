import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from 'images/logo.svg';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-screen bg-zinc-800 text-white'>
      <header className='sticky top-0 left-0 right-0 flex justify-center py-2 bg-gray-800'>
        <Link href='/' passHref>
          <Image
            src={logo}
            alt='Mental Math Trainer logo'
            width={32}
            height={32}
            className='cursor-pointer'
          />
        </Link>
      </header>
      <div className='max-w-screen-md mx-auto mt-2 p-3'>{children}</div>
    </div>
  );
};

export default Layout;

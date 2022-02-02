import Link from 'next/link';
import Image from 'next/image';
import { MenuIcon } from '@heroicons/react/outline';
import Settings from 'components/Settings';
import logo from 'images/logo.svg';

function Layout({ children }) {
  return (
    <div className='h-screen bg-zinc-800 text-white'>
      <header className='sticky top-0 left-0 right-0 flex justify-between items-center p-2 bg-gray-800'>
        <button aria-label='Show menu'>
          <MenuIcon className='h-9 w-9 text-gray-300' />
        </button>
        <Link href='/' passHref>
          <a className='flex items-center gap-4'>
            <Image
              src={logo}
              alt='Mental Math Trainer logo'
              width={36}
              height={36}
            />
            <div className='hidden sm:block text-xl'>Mental Math Trainer</div>
          </a>
        </Link>
        <Settings />
      </header>
      <div className='max-w-screen-md mx-auto mt-2 p-3'>{children}</div>
    </div>
  );
}

export default Layout;

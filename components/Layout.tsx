import Link from 'next/link';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-screen dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-100 text-zinc-900'>
      <header className='sticky top-0 left-0 right-0 flex justify-center dark:bg-sky-900 bg-sky-600'>
        <Link href='/'>
          <a className='text-3xl leading-relaxed'>Mental Math Trainer</a>
        </Link>
      </header>
      <div className='max-w-screen-md mx-auto mt-2 p-3'>{children}</div>
    </div>
  );
};

export default Layout;

import Link from 'next/link';
import Image from 'next/image';
import Menu from 'components/Menu';
import Settings from 'components/Settings';
import logo from 'images/logo.svg';

function Layout({ children }) {
  return (
    <div className='fixed inset-0 flex flex-col overflow-auto bg-zinc-800 text-white'>
      <header className='relative flex items-center justify-between bg-gray-800 p-2'>
        <Menu />
        <Link href='/' passHref>
          <a className='flex items-center gap-4'>
            <Image
              src={logo}
              alt='Mental Math Trainer logo'
              width={36}
              height={36}
            />
            <div className='hidden text-xl sm:block'>Mental Math Trainer</div>
          </a>
        </Link>
        <Settings />
      </header>
      <main className='mx-auto my-3 w-full max-w-screen-md flex-auto px-3'>
        {children}
      </main>
    </div>
  );
}

export default Layout;

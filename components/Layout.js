import Image from 'next/image';
import Link from 'next/link';
import MenuSidebar from 'components/MenuSidebar';
import SettingsSidebar from 'components/SettingsSidebar';
import logo from 'public/logo.svg';

export default function Layout({ children }) {
  return (
    <div className='fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden bg-zinc-800 text-white'>
      <header className='grid h-12 grid-cols-[2.25rem_1fr_2.25rem] bg-gray-800 px-2'>
        <MenuSidebar />
        <Link href='/' passHref>
          <a className='flex select-none items-center gap-4 justify-self-center'>
            <Image
              src={logo}
              alt='Mental Math Trainer logo'
              width={36}
              height={36}
            />
            <div className='hidden text-xl sm:block'>Mental Math Trainer</div>
          </a>
        </Link>
        <SettingsSidebar />
      </header>
      <main className='mx-auto my-3 w-full max-w-screen-md flex-auto px-3'>
        {children}
      </main>
    </div>
  );
}

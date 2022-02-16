import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { MarkGithubIcon } from '@primer/octicons-react';
import googleLogo from 'public/google-logo.svg';

export default function SignIn() {
  return (
    <>
      <div className='mx-auto mt-5 flex w-max flex-col items-stretch gap-2.5'>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className='flex items-center gap-2.5 rounded-md bg-cyan-800 py-1.5 px-3 text-lg active:brightness-[0.85]'
        >
          <Image src={googleLogo} alt='Google logo' width={24} height={24} />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className='flex items-center gap-2.5 rounded-md bg-cyan-800 py-1.5 px-3 text-lg active:brightness-[0.85]'
        >
          <MarkGithubIcon size={24} fill='black' />
          Sign in with GitHub
        </button>
      </div>
    </>
  );
}

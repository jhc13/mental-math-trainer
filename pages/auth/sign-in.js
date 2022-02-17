import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { MarkGithubIcon } from '@primer/octicons-react';
import googleLogo from 'public/google-logo.svg';

function EmailSignIn() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async ({ email }) => {
    await signIn('email', {
      email,
      callbackUrl: '/'
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <label htmlFor='email' className='mb-1 text-lg'>
        Email
      </label>
      <input
        type='email'
        id='email'
        placeholder='email@example.com'
        autoComplete='email'
        {...register('email', { required: true })}
        className='h-12 w-72 rounded-t-md rounded-b-none bg-zinc-700 px-3'
      />
      <button className='rounded-b-md bg-cyan-800 py-2.5 text-lg active:brightness-[0.85]'>
        Sign in with email
      </button>
    </form>
  );
}

export default function SignIn() {
  return (
    <>
      <div className='mx-auto mt-5 flex w-max select-none flex-col items-stretch gap-2.5'>
        <EmailSignIn />
        <div className='flex items-center justify-between gap-1.5'>
          <div className='h-px flex-auto bg-zinc-400' />
          or
          <div className='h-px flex-auto bg-zinc-400' />
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className='flex items-center justify-center gap-2.5 rounded-md bg-cyan-800 py-2.5 text-lg active:brightness-[0.85]'
        >
          <Image src={googleLogo} alt='Google logo' width={24} height={24} />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className='flex items-center justify-center gap-2.5 rounded-md bg-cyan-800 py-2.5 text-lg active:brightness-[0.85]'
        >
          <MarkGithubIcon size={24} fill='black' />
          Sign in with GitHub
        </button>
      </div>
    </>
  );
}

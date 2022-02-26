import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { MarkGithubIcon } from '@primer/octicons-react';
import GoogleLogo from 'public/google-logo.svg';

const DEFAULT_ERROR_MESSAGE =
  'An error occurred while attempting to sign in. Try signing in with a different account.';

const errorMessages = {
  OAuthSignin: DEFAULT_ERROR_MESSAGE,
  OAuthCallback: DEFAULT_ERROR_MESSAGE,
  OAuthCreateAccount: DEFAULT_ERROR_MESSAGE,
  EmailCreateAccount: DEFAULT_ERROR_MESSAGE,
  Callback: DEFAULT_ERROR_MESSAGE,
  OAuthAccountNotLinked:
    'The email address associated with that account is already linked to a different account that was previously used to sign in. Sign in with the previously used account.',
  EmailSignin: 'An error occurred while sending the sign-in email.',
  SessionRequired: 'You must be signed in to access this page.',
  Default: DEFAULT_ERROR_MESSAGE
};

function EmailSignIn({ setEmail, setSignInEmailSent }) {
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit } = useForm();
  const onSubmit = async ({ email }) => {
    setIsSending(true);
    const { url } = await signIn('email', {
      email,
      callbackUrl: '/',
      redirect: false
    });
    setIsSending(false);
    if (url !== null) {
      setEmail(email);
      setSignInEmailSent(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex select-none flex-col shadow-md'
    >
      <label htmlFor='email' className='mb-1 text-lg'>
        Email
      </label>
      <input
        type='email'
        id='email'
        placeholder='email@example.com'
        autoComplete='email'
        {...register('email', { required: true })}
        className='h-12 rounded-t-md rounded-b-none bg-zinc-700 px-3'
      />
      <button className='rounded-b-md bg-cyan-800 py-2.5 text-lg active:brightness-[0.85]'>
        {isSending ? 'Sending sign-in link...' : 'Sign in with email'}
      </button>
    </form>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState(null);
  const [signInEmailSent, setSignInEmailSent] = useState(false);
  const router = useRouter();
  const { error } = router.query;

  if (signInEmailSent) {
    return (
      <>
        <Head>
          <title>Sign-In Link Sent – Mental Math Trainer</title>
        </Head>
        <div className='mt-8'>
          <h1 className='text-center text-xl font-semibold'>
            Check your email
          </h1>
          <p className='mt-1 text-center text-lg'>
            {`A sign-in link has been sent to ${email}.`}
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Sign-In – Mental Math Trainer</title>
      </Head>
      <div className='mx-auto mt-8 flex w-72 flex-col items-stretch gap-2.5'>
        <EmailSignIn
          setEmail={setEmail}
          setSignInEmailSent={setSignInEmailSent}
        />
        <div className='flex select-none items-center justify-between gap-1.5'>
          <div className='h-px flex-auto bg-zinc-400' />
          or
          <div className='h-px flex-auto bg-zinc-400' />
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className='flex select-none items-center justify-center gap-2.5 rounded-md bg-cyan-800 py-2.5 text-lg shadow-md active:brightness-[0.85]'
        >
          <GoogleLogo className='h-6 w-6' />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className='flex select-none items-center justify-center gap-2.5 rounded-md bg-cyan-800 py-2.5 text-lg shadow-md active:brightness-[0.85]'
        >
          <MarkGithubIcon size={24} fill='black' />
          Sign in with GitHub
        </button>
        {error !== undefined && (
          <p className='text-red-400'>{errorMessages[error]}</p>
        )}
      </div>
    </>
  );
}

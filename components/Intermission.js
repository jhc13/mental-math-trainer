import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SettingsContext } from 'utils/settings';
import { OPERATORS, pluralize } from 'utils/format';
import SetResults from 'components/SetResults';
import SetSettings from 'components/SetSettings';

export default function Intermission({ problems, onNewSet }) {
  const { data: session } = useSession();
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, setProblemCount } = settings;

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if ([' ', 'Enter'].includes(key)) {
        onNewSet();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewSet]);

  return (
    <>
      <div className='mt-8 mb-5 flex flex-auto flex-col gap-8'>
        {problems && <SetResults problems={problems} />}
        <div className={`${problems ? 'hidden sm:block' : ''} mx-auto`}>
          <SetSettings onNewSet={onNewSet} />
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <div
            className={`${problems ? 'block sm:hidden' : 'hidden'} font-medium`}
          >{`${pluralize('digit', operandLengths[0])} ${
            OPERATORS[operation]
          } ${pluralize('digit', operandLengths[1])}, ${pluralize(
            'problem',
            setProblemCount
          )}`}</div>
          <button
            onClick={onNewSet}
            className='select-none rounded-lg bg-cyan-800 px-3.5 py-2 text-2xl font-medium active:brightness-[0.85]'
          >
            New Set
          </button>
        </div>
        {session === null && (
          <p className='mx-auto w-fit px-8'>
            <strong className='font-semibold'>You are not signed in.</strong>{' '}
            <Link href='/auth/sign-in'>
              <a className='text-blue-400 underline'>Sign in</a>
            </Link>{' '}
            to save your times and keep track of your progress.
          </p>
        )}
      </div>
    </>
  );
}

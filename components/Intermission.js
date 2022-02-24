import { useEffect } from 'react';
import SetResults from 'components/SetResults';
import SetSettings from 'components/SetSettings';

export default function Intermission({ problems, onNewSet }) {
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
      <div className='mt-8 mb-5 flex flex-auto flex-col gap-4'>
        {problems && <SetResults problems={problems} />}
        <SetSettings onNewSet={onNewSet} />
        <button
          onClick={onNewSet}
          className='mx-auto block select-none rounded-lg bg-cyan-800 px-3.5 py-2 text-2xl font-medium active:brightness-[0.85]'
        >
          New Set
        </button>
      </div>
    </>
  );
}

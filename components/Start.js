import { useEffect } from 'react';

function Start({ onButtonClick }) {
  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if ([' ', 'Enter'].includes(key)) {
        onButtonClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onButtonClick]);

  return (
    <div className='flex h-full items-center justify-center'>
      <button
        onClick={onButtonClick}
        className='rounded-xl bg-cyan-800 px-7 py-3 text-5xl'
      >
        Start
      </button>
    </div>
  );
}

export default Start;

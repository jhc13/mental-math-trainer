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
    <button
      onClick={onButtonClick}
      className='mx-auto mt-[30vh] block select-none rounded-xl bg-cyan-800 px-7 py-3 text-5xl'
    >
      Start
    </button>
  );
}

export default Start;

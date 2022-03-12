import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Trainer() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { status: sessionStatus } = useSession();

  // Abort if the user signs out during a set.
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      setIsSolving(false);
    }
  }, [sessionStatus]);

  const handleSetEnd = useCallback(() => {
    setIsSolving(false);
  }, []);

  const handleNewSet = () => {
    setSolvedProblems([]);
    setIsSolving(true);
  };

  return (
    <>
      <Head>
        <title>Mental Math Trainer</title>
        <meta
          name='description'
          content={`Train your mental math skills with problems customizable from 1 to ${MAX_OPERAND_LENGTH} digits. Save your solve times and keep track of your records and progress.`}
        />
      </Head>
      {isSolving ? (
        <Set
          solvedProblems={solvedProblems}
          setSolvedProblems={setSolvedProblems}
          onSetEnd={handleSetEnd}
        />
      ) : (
        <Intermission problems={solvedProblems} onNewSet={handleNewSet} />
      )}
    </>
  );
}

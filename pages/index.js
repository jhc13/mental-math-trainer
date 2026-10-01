import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Intermission from 'components/Intermission';
import Set from 'components/Set';

export default function Trainer() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [savedBests, setSavedBests] = useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const wasSignedIn = useRef(false);
  const startedSetCount = useRef(0);

  // Abort if the user signs out during a set.
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      wasSignedIn.current = true;
    } else if (sessionStatus === 'unauthenticated' && wasSignedIn.current) {
      wasSignedIn.current = false;
      setIsSolving(false);
    }
  }, [sessionStatus]);

  const handleSetEnd = useCallback(
    async (problems) => {
      setIsSolving(false);
      const startedSetCountAtEnd = startedSetCount.current;
      if (problems.length === 0) {
        return;
      }
      const userId = (
        sessionStatus === 'loading' ? await getSession() : session
      )?.user.id;
      if (!userId) {
        return;
      }
      const response = await fetch(`/api/users/${userId}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problems)
      });
      const bests = await response.json();
      if (startedSetCount.current !== startedSetCountAtEnd) {
        return;
      }
      setSavedBests(bests);
    },
    [sessionStatus, session]
  );

  const handleNewSet = () => {
    setSolvedProblems([]);
    setSavedBests(null);
    startedSetCount.current++;
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
        <Intermission
          problems={solvedProblems}
          savedBests={savedBests}
          onNewSet={handleNewSet}
        />
      )}
    </>
  );
}

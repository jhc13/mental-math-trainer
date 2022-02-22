import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Trainer() {
  const [isSolving, setIsSolving] = useState(false);
  const [problems, setProblems] = useState(null);
  const { data: session } = useSession();

  // Abort if the user signs out during a set.
  useEffect(() => {
    if (!session) {
      setIsSolving(false);
    }
  }, [session]);

  const handleAbort = () => {
    setIsSolving(false);
  };

  const handleSetEnd = useCallback(async (problems) => {
    setProblems(problems);
    setIsSolving(false);
  }, []);

  const handleNewSet = () => {
    setProblems(null);
    setIsSolving(true);
  };

  return isSolving ? (
    <Set onAbort={handleAbort} onSetEnd={handleSetEnd} />
  ) : (
    <Intermission problems={problems} onNewSet={handleNewSet} />
  );
}

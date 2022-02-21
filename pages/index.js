import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Trainer() {
  const [isSolving, setIsSolving] = useState(false);
  const [problems, setProblems] = useState([]);
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

  const handleSetEnd = async (problems) => {
    setProblems(problems);
    setIsSolving(false);
    if (session) {
      await fetch(`/api/users/${session.user.id}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problems)
      });
    }
  };

  const handleNewSet = () => {
    setProblems([]);
    setIsSolving(true);
  };

  return isSolving ? (
    <Set onAbort={handleAbort} onSetEnd={handleSetEnd} />
  ) : (
    <Intermission problems={problems} onNewSet={handleNewSet} />
  );
}

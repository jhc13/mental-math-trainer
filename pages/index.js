import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { data: session } = useSession();

  const handleAbort = () => {
    setIsSolving(false);
  };

  const handleSetEnd = async (solvedProblems) => {
    setSolvedProblems(solvedProblems);
    setIsSolving(false);
    if (session) {
      await fetch(`/api/users/${session.user.id}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solvedProblems)
      });
    }
  };

  const handleNewSet = () => {
    setSolvedProblems([]);
    setIsSolving(true);
  };

  return isSolving ? (
    <Set onAbort={handleAbort} onSetEnd={handleSetEnd} />
  ) : (
    <Intermission solvedProblems={solvedProblems} onNewSet={handleNewSet} />
  );
}

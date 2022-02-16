import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, problemsPerSet } = settings;

  useEffect(() => {
    setIsSolving(false);
  }, [operation, operandLengths, problemsPerSet]);

  const handleAbort = () => {
    setIsSolving(false);
  };

  const handleSetEnd = (solvedProblems) => {
    setSolvedProblems(solvedProblems);
    setIsSolving(false);
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

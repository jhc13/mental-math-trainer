import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Solve from 'components/Solve';
import Intermission from 'components/Intermission';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, problemsPerSet } = settings;

  const reset = () => {
    setIsSolving(false);
    setSolvedProblems([]);
  };

  useEffect(() => {
    reset();
  }, [operation, operandLengths, problemsPerSet]);

  useEffect(() => {
    if (solvedProblems.length === problemsPerSet) {
      setIsSolving(false);
    }
  }, [solvedProblems, problemsPerSet, operation]);

  const handleCorrectAnswer = (problem) => {
    setSolvedProblems((problems) => [...problems, problem]);
  };

  const handleAbort = () => {
    reset();
  };

  const handleNewSet = () => {
    reset();
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve
      solvedProblemCount={solvedProblems.length}
      onCorrectAnswer={handleCorrectAnswer}
      onAbort={handleAbort}
    />
  ) : (
    <Intermission solvedProblems={solvedProblems} onNewSet={handleNewSet} />
  );
}

export default Home;

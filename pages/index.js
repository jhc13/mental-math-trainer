import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Solve from 'components/Solve';
import Intermission from 'components/Intermission';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [setStartTime, setSetStartTime] = useState(null);
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, problemsPerSet } = settings;

  const reset = () => {
    setIsSolving(false);
    setSolvedProblems([]);
    setSetStartTime(null);
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
    setSetStartTime(Date.now());
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve
      solvedProblemCount={solvedProblems.length}
      setStartTime={setStartTime}
      onCorrectAnswer={handleCorrectAnswer}
      onAbort={handleAbort}
    />
  ) : (
    <Intermission solvedProblems={solvedProblems} onNewSet={handleNewSet} />
  );
}

export default Home;

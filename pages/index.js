import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Solve from 'components/Solve';
import Intermission from 'components/Intermission';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [problems, setProblems] = useState([]);
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength, problemsPerSet } =
    settings;

  const reset = () => {
    setIsSolving(false);
    setProblems([]);
  };

  useEffect(() => {
    reset();
  }, [operation, firstOperandLength, secondOperandLength, problemsPerSet]);

  useEffect(() => {
    if (problems.length === problemsPerSet) {
      setIsSolving(false);
    }
  }, [problems, problemsPerSet, operation]);

  const handleCorrectAnswer = (problem) => {
    setProblems((problems) => [...problems, problem]);
  };

  const handleAbort = () => {
    reset();
  };

  const handleNewSet = () => {
    reset();
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve onCorrectAnswer={handleCorrectAnswer} onAbort={handleAbort} />
  ) : (
    <Intermission problems={problems} onNewSet={handleNewSet} />
  );
}

export default Home;

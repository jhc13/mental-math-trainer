import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Solve from 'components/Solve';
import Intermission from 'components/Intermission';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [problems, setProblems] = useState([]);
  const [problemCount, setProblemCount] = useState(0);
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength, problemsPerSet } =
    settings;

  const reset = () => {
    setIsSolving(false);
    setProblems([]);
    setProblemCount(0);
  };

  useEffect(() => {
    reset();
  }, [operation, firstOperandLength, secondOperandLength, problemsPerSet]);

  useEffect(() => {
    if (problemCount === problemsPerSet) {
      setIsSolving(false);
    }
  }, [problemCount, problems, problemsPerSet, operation]);

  const handleCorrectAnswer = (problem) => {
    setProblems((problems) => [...problems, problem]);
    setProblemCount((count) => count + 1);
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

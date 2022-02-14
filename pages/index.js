import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import { formatCentiseconds, OPERATORS } from 'utils/utils';
import Solve from 'components/Solve';
import Start from 'components/Start';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [problems, setProblems] = useState([]);
  const [problemCount, setProblemCount] = useState(0);
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength, problemsPerSet } =
    settings;

  useEffect(() => {
    setIsSolving(false);
    setProblemCount(0);
  }, [operation, firstOperandLength, secondOperandLength, problemsPerSet]);

  useEffect(() => {
    if (problemCount === problemsPerSet) {
      const operator = OPERATORS[operation];
      console.log(
        problems.map((problem) => {
          const { operands, centiseconds } = problem;
          return `${operands[0]} ${operator} ${
            operands[1]
          }: ${formatCentiseconds(centiseconds)}`;
        })
      );
      setIsSolving(false);
      setProblems([]);
      setProblemCount(0);
    }
  }, [problemCount, problems, problemsPerSet, operation]);

  const handleCorrectAnswer = (problem) => {
    setProblems((problems) => [...problems, problem]);
    setProblemCount((count) => count + 1);
  };

  const handleStartButtonClick = () => {
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve onCorrectAnswer={handleCorrectAnswer} />
  ) : (
    <Start onButtonClick={handleStartButtonClick} />
  );
}

export default Home;

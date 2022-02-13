import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import { formatCentiseconds, OPERATORS } from 'utils/utils';
import Solve from 'components/Solve';
import Start from 'components/Start';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const { settings } = useContext(SettingsContext);
  const {
    operation,
    firstOperandLength,
    secondOperandLength,
    breakBetweenSets,
    problemsPerSet
  } = settings;

  useEffect(() => {
    setIsSolving(false);
    setProblemCount(0);
  }, [
    operation,
    firstOperandLength,
    secondOperandLength,
    breakBetweenSets,
    problemsPerSet
  ]);

  useEffect(() => {
    if (breakBetweenSets && problemCount === problemsPerSet) {
      setIsSolving(false);
      setProblemCount(0);
    }
  }, [problemCount, breakBetweenSets, problemsPerSet]);

  const handleCorrectAnswer = ({ operation, operands, centiseconds }) => {
    const operator = OPERATORS[operation];
    console.log(
      `${operands[0]} ${operator} ${operands[1]}: ${formatCentiseconds(
        centiseconds
      )}`
    );
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

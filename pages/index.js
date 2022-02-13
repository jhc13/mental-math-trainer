import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import { formatCentiseconds, OPERATORS } from 'utils/utils';
import Solve from 'components/Solve';
import Start from 'components/Start';

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength } = settings;

  useEffect(() => {
    setIsSolving(false);
  }, [operation, firstOperandLength, secondOperandLength]);

  const handleCorrectAnswer = ({ operation, operands, centiseconds }) => {
    const operator = OPERATORS[operation];
    console.log(
      `${operands[0]} ${operator} ${operands[1]}: ${formatCentiseconds(
        centiseconds
      )}`
    );
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

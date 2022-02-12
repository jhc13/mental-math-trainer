import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Solve from 'components/Solve';
import Start from 'components/Start';

function Home() {
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength } = settings;
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    setIsSolving(false);
  }, [operation, firstOperandLength, secondOperandLength]);

  const handleCorrectAnswer = () => {
    setIsSolving(false);
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

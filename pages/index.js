import { useState } from 'react';
import Solve from 'components/Solve';
import Start from 'components/Start';

function Home() {
  const [isSolving, setIsSolving] = useState(false);

  const handleStartButtonClick = () => {
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve />
  ) : (
    <Start onButtonClick={handleStartButtonClick} />
  );
}

export default Home;

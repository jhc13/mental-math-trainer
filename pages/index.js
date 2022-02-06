import { useState } from 'react';
import Solve from 'components/Solve';
import Start from 'components/Start';

// min: inclusive, max: exclusive
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomIntegerByLength(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  return getRandomInteger(min, max);
}

function getOperands(operation, operandLengths) {
  switch (operation) {
    case 'addition':
    case 'multiplication':
      return operandLengths.map((length) => getRandomIntegerByLength(length));
    case 'subtraction':
      if (operandLengths[0] !== operandLengths[1]) {
        return operandLengths.map((length) => getRandomIntegerByLength(length));
      }
      const minMinuend = Math.pow(10, operandLengths[0] - 1) + 1;
      const maxMinuend = Math.pow(10, operandLengths[0]);
      const minuend = getRandomInteger(minMinuend, maxMinuend);
      const subtrahend = getRandomInteger(minMinuend - 1, minuend);
      return [minuend, subtrahend];
    case 'division':
      let divisor, minQuotient, maxQuotient;
      if (operandLengths[0] === operandLengths[1]) {
        if (operandLengths[0] === 1) {
          // Exclude 1.
          divisor = getRandomInteger(2, 5);
        } else {
          const minDivisor = Math.pow(10, operandLengths[0] - 1);
          const maxDivisor = Math.pow(10, operandLengths[0]) / 2;
          divisor = getRandomInteger(minDivisor, maxDivisor);
        }
        minQuotient = 2;
        // maxQuotient is inclusive.
        maxQuotient = Math.floor(
          (Math.pow(10, operandLengths[0]) - 1) / divisor
        );
      } else {
        if (operandLengths[1] === 1) {
          // Exclude 1.
          divisor = getRandomInteger(2, 10);
        } else {
          divisor = getRandomIntegerByLength(operandLengths[1]);
        }
        minQuotient = Math.ceil(Math.pow(10, operandLengths[0] - 1) / divisor);
        // maxQuotient is inclusive.
        maxQuotient = Math.floor(
          (Math.pow(10, operandLengths[0]) - 1) / divisor
        );
      }
      const quotient = getRandomInteger(minQuotient, maxQuotient + 1);
      const dividend = divisor * quotient;
      return [dividend, divisor];
  }
}

function Home() {
  const [isSolving, setIsSolving] = useState(false);
  const [operands, setOperands] = useState(null);
  const operandLengths = [2, 2];
  const operation = 'multiplication';

  const handleCorrectAnswer = () => {
    setIsSolving(false);
  };

  const handleStartButtonClick = () => {
    setOperands(getOperands(operation, operandLengths));
    setIsSolving(true);
  };

  return isSolving ? (
    <Solve
      operands={operands}
      operation={operation}
      onCorrectAnswer={handleCorrectAnswer}
    />
  ) : (
    <Start onButtonClick={handleStartButtonClick} />
  );
}

export default Home;

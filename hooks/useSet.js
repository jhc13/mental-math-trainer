import { useCallback, useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';

function getMaxAnswerLength(operands, operation) {
  const operandLengths = operands.map((operand) => operand.toString().length);
  switch (operation) {
    case 'ADDITION':
      return Math.max(...operandLengths) + 1;
    case 'SUBTRACTION':
    case 'DIVISION':
      return operandLengths[0];
    case 'MULTIPLICATION':
      return operandLengths[0] + operandLengths[1];
  }
}

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
    case 'ADDITION':
    case 'MULTIPLICATION':
      return operandLengths.map((length) =>
        length === 1
          ? // Exclude 1.
            getRandomInteger(2, 10)
          : getRandomIntegerByLength(length)
      );
    case 'SUBTRACTION':
      if (operandLengths[0] !== operandLengths[1]) {
        return operandLengths.map((length) => getRandomIntegerByLength(length));
      }
      const minMinuend = Math.pow(10, operandLengths[0] - 1) + 1;
      const maxMinuend = Math.pow(10, operandLengths[0]);
      const minuend = getRandomInteger(minMinuend, maxMinuend);
      const subtrahend = getRandomInteger(minMinuend - 1, minuend);
      return [minuend, subtrahend];
    case 'DIVISION':
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

export default function useSet(onAbort, onSetEnd) {
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, problemsPerSet, inputDirection } =
    settings;
  const [operands, setOperands] = useState(
    getOperands(operation, operandLengths)
  );
  const [answerString, setAnswerString] = useState('');
  const [setStartTime] = useState(Date.now());
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const [solvedProblems, setSolvedProblems] = useState([]);
  const maxAnswerLength = getMaxAnswerLength(operands, operation);

  const clear = () => {
    setAnswerString('');
  };

  const backspace = useCallback(() => {
    if (inputDirection === 'RIGHT_TO_LEFT') {
      setAnswerString((answerString) => answerString.slice(1));
    } else {
      setAnswerString((answerString) => answerString.slice(0, -1));
    }
  }, [inputDirection]);

  const appendDigit = useCallback(
    (digit) => {
      if (answerString.length >= maxAnswerLength) {
        return;
      }
      if (inputDirection === 'RIGHT_TO_LEFT') {
        setAnswerString((answerString) => digit + answerString);
      } else {
        setAnswerString((answerString) => answerString + digit);
      }
    },
    [answerString, inputDirection, maxAnswerLength]
  );

  const reset = useCallback(() => {
    setOperands(getOperands(operation, operandLengths));
    clear();
    setProblemStartTime(Date.now());
  }, [operation, operandLengths]);

  const handleKeypadPress = useCallback(
    (key) => {
      if (key === 'CLEAR') {
        clear();
      } else if (key === 'BACKSPACE') {
        backspace();
      } else {
        appendDigit(key);
      }
    },
    [backspace, appendDigit]
  );

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (/^\d$/.test(key)) {
        handleKeypadPress(key);
      } else if (['Backspace', 'Delete'].includes(key)) {
        handleKeypadPress('BACKSPACE');
      } else if (key.toLowerCase() === 'c') {
        handleKeypadPress('CLEAR');
      } else if (key === 'Escape') {
        onAbort();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeypadPress, onAbort]);

  useEffect(() => {
    let correctAnswer;
    switch (operation) {
      case 'ADDITION':
        correctAnswer = BigInt(operands[0]) + BigInt(operands[1]);
        break;
      case 'SUBTRACTION':
        correctAnswer = BigInt(operands[0]) - BigInt(operands[1]);
        break;
      case 'MULTIPLICATION':
        correctAnswer = BigInt(operands[0]) * BigInt(operands[1]);
        break;
      case 'DIVISION':
        correctAnswer = BigInt(operands[0]) / BigInt(operands[1]);
        break;
    }
    if (BigInt(answerString) === correctAnswer) {
      const centiseconds = Math.floor((Date.now() - problemStartTime) / 10);
      const problem = {
        operation,
        operandLengths,
        operands,
        centiseconds,
        timestamp: new Date()
      };
      setSolvedProblems((problems) => [...problems, problem]);
      reset();
    }
  }, [
    answerString,
    operation,
    operands,
    problemStartTime,
    operandLengths,
    reset
  ]);

  useEffect(() => {
    if (solvedProblems.length === problemsPerSet) {
      onSetEnd(solvedProblems);
    }
  }, [solvedProblems, problemsPerSet, onSetEnd]);

  return {
    operation,
    operands,
    answerString,
    setStartTime,
    problemStartTime,
    solvedProblemCount: solvedProblems.length,
    maxAnswerLength,
    handleKeypadPress
  };
}

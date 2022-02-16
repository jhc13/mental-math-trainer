import { useCallback, useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';

function getMaxAnswerLength(operands, operation) {
  const operandLengths = operands.map((operand) => operand.toString().length);
  switch (operation) {
    case 'addition':
      return Math.max(...operandLengths) + 1;
    case 'subtraction':
    case 'division':
      return operandLengths[0];
    case 'multiplication':
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
    case 'addition':
    case 'multiplication':
      return operandLengths.map((length) =>
        length === 1
          ? // Exclude 1.
            getRandomInteger(2, 10)
          : getRandomIntegerByLength(length)
      );
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
    if (inputDirection === 'right to left') {
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
      if (inputDirection === 'right to left') {
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
      if (key === 'clear') {
        clear();
      } else if (key === 'backspace') {
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
        handleKeypadPress('backspace');
      } else if (key.toLowerCase() === 'c') {
        handleKeypadPress('clear');
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
      case 'addition':
        correctAnswer = BigInt(operands[0]) + BigInt(operands[1]);
        break;
      case 'subtraction':
        correctAnswer = BigInt(operands[0]) - BigInt(operands[1]);
        break;
      case 'multiplication':
        correctAnswer = BigInt(operands[0]) * BigInt(operands[1]);
        break;
      case 'division':
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
        time: Date.now()
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

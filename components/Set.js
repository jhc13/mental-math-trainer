import { useContext, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';
import useSet from 'hooks/useSet';
import { SettingsContext } from 'utils/settings';
import Timer from 'components/Timer';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

export default function Set({ solvedProblems, setSolvedProblems, onSetEnd }) {
  const { settings } = useContext(SettingsContext);
  let {
    operation,
    operandLengths,
    setProblemCount,
    showProblemNumber,
    showTimer,
    timerDisplayTime,
    showAbortButton
  } = settings;
  // Freeze the set settings to their initial values.
  [operation] = useState(operation);
  [operandLengths] = useState(operandLengths);
  [setProblemCount] = useState(setProblemCount);

  const {
    operands,
    answerString,
    setStartTime,
    problemStartTime,
    maxAnswerLength,
    handleKeypadPress,
    operationFromOperands
  } = useSet(
    solvedProblems,
    setSolvedProblems,
    onSetEnd,
    operation,
    operandLengths,
    setProblemCount
  );

  return (
    <div className='flex h-full flex-col items-center px-3 pb-5 pt-3'>
      <div className='grid w-full grid-cols-3 place-items-center'>
        <div className='justify-self-start text-2xl tabular-nums leading-9'>
          {showProblemNumber &&
            `${solvedProblems.length + 1}/${setProblemCount}`}
        </div>
        <div className='col-start-2'>
          {showTimer && (
            <Timer
              startTime={
                timerDisplayTime === 'SET_TIME'
                  ? setStartTime
                  : problemStartTime
              }
            />
          )}
        </div>
        {showAbortButton && (
          <button
            className='col-start-3 flex items-center gap-1.5 justify-self-end rounded-md bg-red-900 px-2 py-1 active:brightness-[0.85]'
            onClick={onSetEnd}
          >
            <XCircleIcon className='h-5 w-5' aria-hidden='true' />
            <div className='text-lg'>Abort</div>
          </button>
        )}
      </div>
      <div className={'flex flex-auto items-center'}>
        <Problem
          operation={operation}
          operationFromOperands={operationFromOperands}
          operands={operands}
          maxAnswerLength={maxAnswerLength}
          answerString={answerString}
        />
      </div>
      <Keypad onKeyClick={handleKeypadPress} />
    </div>
  );
}

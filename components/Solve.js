import { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';
import useSolve from 'hooks/useSolve';
import { SettingsContext } from 'utils/settings';
import Timer from 'components/Timer';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

function Solve({ solvedProblemCount, setStartTime, onCorrectAnswer, onAbort }) {
  const { settings } = useContext(SettingsContext);
  const {
    problemsPerSet,
    showProblemNumber,
    showTimer,
    measuredTime,
    showAbortButton
  } = settings;

  const {
    operation,
    operands,
    answerString,
    problemStartTime,
    maxAnswerLength,
    handleKeyClick
  } = useSolve(onCorrectAnswer, onAbort);

  return (
    <div className='flex h-full flex-col items-center'>
      <div className='grid w-full grid-cols-3 place-items-center'>
        <div className='justify-self-start text-2xl tabular-nums leading-9'>
          {showProblemNumber && `${solvedProblemCount + 1}/${problemsPerSet}`}
        </div>
        <div className='col-start-2'>
          {showTimer && (
            <Timer
              startTime={
                measuredTime === 'set time' ? setStartTime : problemStartTime
              }
            />
          )}
        </div>
        {showAbortButton && (
          <button
            className='col-start-3 flex items-center gap-1.5 justify-self-end rounded-md bg-red-900 px-2 py-1 active:brightness-[0.85]'
            onClick={onAbort}
          >
            <XCircleIcon className='h-5 w-5' aria-hidden='true' />
            <div className='text-lg'>Abort</div>
          </button>
        )}
      </div>
      <div className={'flex flex-auto items-center'}>
        <Problem
          operation={operation}
          operands={operands}
          maxAnswerLength={maxAnswerLength}
          answerString={answerString}
        />
      </div>
      <Keypad onKeyClick={handleKeyClick} />
    </div>
  );
}

export default Solve;

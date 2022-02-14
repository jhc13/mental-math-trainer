import { useContext } from 'react';
import useSolve from 'hooks/useSolve';
import { SettingsContext } from 'utils/settings';
import Timer from 'components/Timer';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

function Solve({ onCorrectAnswer, onAbort }) {
  const { settings } = useContext(SettingsContext);
  const { showTimerWhileSolving } = settings;

  const {
    operation,
    operands,
    answerString,
    startTime,
    maxAnswerLength,
    handleKeyClick
  } = useSolve(onCorrectAnswer, onAbort);

  return (
    <div className='flex h-full flex-col items-center'>
      {showTimerWhileSolving && <Timer startTime={startTime} />}
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

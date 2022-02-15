import { useEffect } from 'react';
import { formatCentiseconds, OPERATORS, pluralize } from 'utils/utils';

function Intermission({ solvedProblems, onNewSet }) {
  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if ([' ', 'Enter'].includes(key)) {
        onNewSet();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewSet]);

  let totalCentiseconds, centisecondsPerProblem;
  if (solvedProblems.length) {
    totalCentiseconds = solvedProblems.reduce(
      (centiseconds, problem) => centiseconds + problem.centiseconds,
      0
    );
    centisecondsPerProblem = Math.round(
      totalCentiseconds / solvedProblems.length
    );
  }

  return (
    <div className='flex flex-col gap-10 pt-5'>
      {solvedProblems.length > 0 && (
        <div className='flex flex-col items-center gap-5'>
          <div className='flex flex-col gap-1 text-center text-xl'>
            <div className='font-bold'>
              {`${pluralize(
                'problem',
                solvedProblems.length
              )} in ${formatCentiseconds(totalCentiseconds)}`}
            </div>
            {`(${formatCentiseconds(centisecondsPerProblem)} per problem)`}
          </div>
          <div className='flex max-h-[22rem] w-full justify-center overflow-auto'>
            <div className='text-left text-lg tabular-nums'>
              {solvedProblems.map((problem, i) => {
                const { operation, operands, centiseconds } = problem;
                const operator = OPERATORS[operation];
                return (
                  <div key={i}>{`${operands[0]}${operator}${
                    operands[1]
                  }: ${formatCentiseconds(centiseconds)}`}</div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onNewSet}
        className='mx-auto select-none rounded-lg bg-cyan-800 px-3 py-2 text-2xl active:brightness-[0.85]'
      >
        New Set
      </button>
    </div>
  );
}

export default Intermission;

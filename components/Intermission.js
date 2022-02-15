import { useEffect } from 'react';
import { formatCentiseconds, OPERATORS, pluralize } from 'utils/utils';

function Intermission({ problems, onNewSet }) {
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
  if (problems.length) {
    totalCentiseconds = problems.reduce(
      (centiseconds, problem) => centiseconds + problem.centiseconds,
      0
    );
    centisecondsPerProblem = Math.round(totalCentiseconds / problems.length);
  }

  return (
    <div className='flex flex-col gap-10 pt-5'>
      {problems.length > 0 && (
        <div className='flex flex-col items-center gap-5'>
          <div className='flex flex-col gap-1 text-center text-xl'>
            <div className='font-bold'>
              {`${pluralize(
                'problem',
                problems.length
              )} in ${formatCentiseconds(totalCentiseconds)}`}
            </div>
            {`(${formatCentiseconds(centisecondsPerProblem)} per problem)`}
          </div>
          <div className='flex max-h-[22rem] w-96 justify-center overflow-auto px-8'>
            <div className='text-left text-lg tabular-nums'>
              {problems.map((problem, i) => {
                const { operation, operands, centiseconds } = problem;
                const operator = OPERATORS[operation];
                return (
                  <div key={i}>{`${operands[0]} ${operator} ${
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

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { recordFormats, getSetBests } from 'utils/records';
import { formatCentiseconds, OPERATORS, pluralize } from 'utils/format';

export default function SetResults({ problems }) {
  const [bests, setBests] = useState(null);
  const { data: session } = useSession();

  // Get the bests once on initial load.
  useEffect(() => {
    if (bests) {
      return;
    }
    if (session) {
      (async () => {
        const response = await fetch(`/api/users/${session.user.id}/problems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(problems)
        });
        setBests(await response.json());
      })();
    } else {
      // Calculate the bests locally if not signed in.
      setBests(getSetBests(problems));
    }
  }, [problems, bests, session]);

  const totalCentiseconds = problems.reduce(
    (centiseconds, problem) => centiseconds + problem.centiseconds,
    0
  );
  const centisecondsPerProblem = Math.round(
    totalCentiseconds / problems.length
  );

  const formatLabels = [<div key={-1}>Set mean:</div>];
  const formatTimes = [
    <div key={-1}>{formatCentiseconds(centisecondsPerProblem)}</div>
  ];
  if (bests) {
    formatLabels.push(
      ...bests.map((best, i) => {
        return (
          <div
            key={i}
            className={best.isNewRecord ? 'font-semibold text-sky-500' : ''}
          >{`Best ${
            best.problemCount === 1
              ? 'single'
              : `${best.calculationMethod.toLowerCase()} of ${
                  best.problemCount
                }`
          }:`}</div>
        );
      })
    );
    formatTimes.push(
      ...bests.map((best, i) => {
        return (
          <div
            key={i}
            className={best.isNewRecord ? 'font-semibold text-sky-500' : ''}
          >
            {formatCentiseconds(best.centiseconds)}
          </div>
        );
      })
    );
  } else {
    const validFormats = recordFormats.filter(
      (format) => format.problemCount <= problems.length
    );
    formatLabels.push(
      ...validFormats.map((format, i) => {
        return (
          <div key={i}>
            {`Best ${
              format.problemCount === 1
                ? 'single'
                : `${format.calculationMethod.toLowerCase()} of ${
                    format.problemCount
                  }`
            }:`}
          </div>
        );
      })
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-center text-2xl font-semibold'>
        {`${pluralize('problem', problems.length)} in ${formatCentiseconds(
          totalCentiseconds
        )}`}
      </h1>
      <div className='grid grid-cols-2 text-lg tabular-nums'>
        <div className='col-span-2 flex justify-center gap-3 sm:col-auto'>
          <div className='text-left'>{formatLabels}</div>
          <div className='text-right'>{formatTimes}</div>
        </div>
        <div className='hidden max-h-[21rem] overflow-auto sm:block'>
          <div className='mx-auto w-fit text-left'>
            {problems.map((problem, i) => {
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
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { recordFormats, getSetBests } from 'utils/records';
import { formatCentiseconds, OPERATORS, pluralize } from 'utils/format';

export default function SetResults({ problems }) {
  const [bests, setBests] = useState(null);
  const [selectedBest, setSelectedBest] = useState(null);
  const firstSelectedBestProblem = useRef();
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

  useEffect(() => {
    if (firstSelectedBestProblem.current) {
      firstSelectedBestProblem.current.scrollIntoView();
    }
  }, [selectedBest]);

  const totalCentiseconds = problems.reduce(
    (centiseconds, problem) => centiseconds + problem.centiseconds,
    0
  );
  const centisecondsPerProblem = Math.round(
    totalCentiseconds / problems.length
  );
  const bestLabels = [<div key={-1}>Set mean:</div>];
  const bestTimes = [
    <div key={-1}>{formatCentiseconds(centisecondsPerProblem)}</div>
  ];
  const handleBestClick = (best) => {
    setSelectedBest(selectedBest === best ? null : best);
  };
  if (bests) {
    bestLabels.push(
      ...bests.map((best, i) => {
        return (
          <div
            key={i}
            onClick={() => handleBestClick(best)}
            className={`${
              best.isNewRecord ? 'font-semibold text-sky-500' : ''
            } cursor-pointer`}
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
    bestTimes.push(
      ...bests.map((best, i) => {
        return (
          <div
            key={i}
            onClick={() => handleBestClick(best)}
            className={`${
              best.isNewRecord ? 'font-semibold text-sky-500' : ''
            } cursor-pointer`}
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
    bestLabels.push(
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
    bestTimes.push(
      ...validFormats.map((_, i) => {
        return <div key={i}>...</div>;
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
      <div className='flex flex-col gap-6 text-lg tabular-nums sm:grid sm:grid-cols-2'>
        <div className='flex justify-center gap-3'>
          <div className='flex flex-col gap-0.5 text-left'>{bestLabels}</div>
          <div className='flex flex-col gap-0.5 text-right'>{bestTimes}</div>
        </div>
        <div className='max-h-[9.5rem] overflow-auto scroll-smooth sm:max-h-[22.5rem]'>
          <div className='grid grid-cols-[auto_auto] justify-center gap-y-0.5 gap-x-1'>
            {problems.map((problem, i) => {
              const { operation, operands, centiseconds } = problem;
              const operator = OPERATORS[operation];
              const refProp =
                selectedBest && i === selectedBest.startIndex
                  ? { ref: firstSelectedBestProblem }
                  : {};
              return (
                <>
                  <div
                    {...refProp}
                    className={`${
                      selectedBest &&
                      i >= selectedBest.startIndex &&
                      i < selectedBest.startIndex + selectedBest.problemCount
                        ? selectedBest.excludedIndices.includes(i)
                          ? 'text-zinc-500 line-through'
                          : 'text-sky-300'
                        : ''
                    } px-1.5 text-right transition-colors`}
                  >
                    {i + 1}.
                  </div>
                  <div
                    className={`${
                      selectedBest &&
                      i >= selectedBest.startIndex &&
                      i < selectedBest.startIndex + selectedBest.problemCount
                        ? selectedBest.excludedIndices.includes(i)
                          ? 'text-zinc-500'
                          : 'text-sky-300'
                        : ''
                    } px-1.5 transition-colors`}
                  >
                    {`${operands[0]}${operator}${
                      operands[1]
                    }: ${formatCentiseconds(centiseconds)}`}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

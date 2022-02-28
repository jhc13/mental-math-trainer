import { Fragment, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Popover, Transition } from '@headlessui/react';
import {
  InformationCircleIcon,
  ExternalLinkIcon
} from '@heroicons/react/solid';
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
  const bestElements = [
    <div key={-2}>Set mean:</div>,
    <div key={-1}>{formatCentiseconds(centisecondsPerProblem)}</div>
  ];
  const handleBestClick = (best) => {
    setSelectedBest(selectedBest === best ? null : best);
  };
  if (bests) {
    for (const [i, best] of bests.entries()) {
      bestElements.push(
        <div
          key={2 * i}
          onClick={() => handleBestClick(best)}
          className={`${
            best.isNewRecord ? 'font-semibold text-sky-500' : ''
          } cursor-pointer`}
        >
          Best{' '}
          {best.problemCount === 1
            ? 'single'
            : `${best.calculationMethod.toLowerCase()} of ${best.problemCount}`}
          :
        </div>,
        <div
          key={2 * i + 1}
          onClick={() => handleBestClick(best)}
          className={`${
            best.isNewRecord ? 'font-semibold text-sky-500' : ''
          } cursor-pointer`}
        >
          {formatCentiseconds(best.centiseconds)}
        </div>
      );
    }
  } else {
    const validFormats = recordFormats.filter(
      (format) => format.problemCount <= problems.length
    );
    for (const [i, format] of validFormats.entries()) {
      bestElements.push(
        <div key={2 * i}>
          Best{' '}
          {format.problemCount === 1
            ? 'single'
            : `${format.calculationMethod.toLowerCase()} of ${
                format.problemCount
              }`}
          :
        </div>,
        <div key={2 * i + 1}>...</div>
      );
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-center text-2xl font-semibold'>
        {`${pluralize('problem', problems.length)} in ${formatCentiseconds(
          totalCentiseconds
        )}`}
      </h1>
      <div className='flex flex-col items-center justify-items-center gap-6 text-lg tabular-nums sm:grid sm:grid-cols-2 sm:items-start'>
        <div className='relative grid w-fit auto-rows-min grid-cols-[auto_auto] gap-x-2.5 gap-y-0.5'>
          <Popover className='absolute -left-9 z-10 flex'>
            <Popover.Button
              aria-label='Information'
              className='p-1 focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit active:brightness-[0.85]'
            >
              <InformationCircleIcon className='h-5 w-5' />
            </Popover.Button>
            <Transition
              enter='transition-opacity duration-200 ease-out'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity duration-150 ease-in'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Popover.Panel className='absolute left-8 w-64 rounded-md bg-zinc-900 p-3 shadow-md sm:w-[24rem]'>
                <div className='flex flex-col gap-4 text-center text-base'>
                  <p>
                    A <strong>mean</strong> is the sum of consecutive solve
                    times divided by the number of problems.
                  </p>
                  <p>
                    An <strong>average</strong> is like a mean, but with the
                    fastest and slowest 5% of results (rounded up) removed. It
                    is also called a{' '}
                    <a
                      href='https://en.wikipedia.org/wiki/Truncated_mean'
                      target='_blank'
                      rel='noreferrer'
                      className='text-blue-400 underline'
                    >
                      trimmed mean
                    </a>
                    <ExternalLinkIcon className='inline h-5 w-5 text-blue-400' />
                    .
                  </p>
                  <p>
                    For example, consider an average of 50. 5% of 50 is 2.5, and
                    rounded up, it is 3. So the fastest 3 results and slowest 3
                    results are excluded, and the remaining 44 solve times are
                    added together and divided by 44.
                  </p>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          {bestElements}
        </div>
        <div className='max-h-[9.5rem] w-full overflow-auto scroll-smooth sm:max-h-[22.5rem]'>
          <div className='grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2.5'>
            {problems.map((problem, i) => {
              const { operation, operands, centiseconds } = problem;
              const operator = OPERATORS[operation];
              const refProp =
                selectedBest && i === selectedBest.startIndex
                  ? { ref: firstSelectedBestProblem }
                  : {};
              return (
                <Fragment key={i}>
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
                    } text-right transition-colors`}
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
                    } transition-colors`}
                  >
                    {`${operands[0]}${operator}${
                      operands[1]
                    }: ${formatCentiseconds(centiseconds)}`}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

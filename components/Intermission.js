import { useContext, useEffect } from 'react';
import { SettingsContext } from 'utils/settings';
import { formatCentiseconds, OPERATORS, pluralize } from 'utils/format';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Listbox from 'components/Listbox';
import NumberInput from 'components/NumberInput';

function getOperandLengths() {
  return [...Array(MAX_OPERAND_LENGTH).keys()].map((i) => i + 1);
}

export default function Intermission({ problems, onNewSet }) {
  const { settings, setSetting } = useContext(SettingsContext);
  const { operation, operandLengths, problemsPerSet } = settings;

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

  useEffect(() => {
    if (
      ['SUBTRACTION', 'DIVISION'].includes(operation) &&
      operandLengths[1] > operandLengths[0]
    ) {
      setSetting('operandLengths', [operandLengths[0], operandLengths[0]]);
    }
  }, [operation, operandLengths, setSetting]);

  let totalCentiseconds, centisecondsPerProblem;
  if (problems.length) {
    totalCentiseconds = problems.reduce(
      (centiseconds, problem) => centiseconds + problem.centiseconds,
      0
    );
    centisecondsPerProblem = Math.round(totalCentiseconds / problems.length);
  }

  const getDefaultChangeHandler = (settingKey) => (value) => {
    setSetting(settingKey, value);
  };

  return (
    <div className='mt-5 flex flex-col gap-10'>
      {problems.length > 0 && (
        <div className='flex flex-col items-center gap-5'>
          <div className='flex flex-col gap-1 text-center text-xl'>
            <h1 className='font-bold'>
              {`${pluralize(
                'problem',
                problems.length
              )} in ${formatCentiseconds(totalCentiseconds)}`}
            </h1>
            {`(${formatCentiseconds(centisecondsPerProblem)} per problem)`}
          </div>
          <div className='flex max-h-36 w-full justify-center overflow-auto sm:max-h-[21rem]'>
            <div className='text-left text-lg tabular-nums'>
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
      )}
      <div className='mx-auto flex select-none flex-col gap-4'>
        <div className='grid grid-cols-[7rem_4.5rem_7rem] gap-3'>
          <Listbox
            value={operandLengths[0]}
            onChange={(value) => {
              setSetting('operandLengths', [value, operandLengths[1]]);
            }}
            optionValues={getOperandLengths()}
            optionNames={getOperandLengths().map((length) =>
              pluralize('digit', length)
            )}
          />
          <Listbox
            value={operation}
            onChange={getDefaultChangeHandler('operation')}
            optionValues={Object.keys(OPERATORS)}
            optionNames={Object.values(OPERATORS)}
          />
          <Listbox
            value={operandLengths[1]}
            onChange={(value) => {
              setSetting('operandLengths', [operandLengths[0], value]);
            }}
            optionValues={getOperandLengths()}
            optionNames={getOperandLengths().map((length) =>
              pluralize('digit', length)
            )}
            disabled={
              ['SUBTRACTION', 'DIVISION'].includes(operation)
                ? Array(operandLengths[0])
                    .fill(false)
                    .concat(
                      Array(MAX_OPERAND_LENGTH - operandLengths[0]).fill(true)
                    )
                : Array(MAX_OPERAND_LENGTH).fill(false)
            }
          />
        </div>
        <div className='flex items-center justify-center gap-3'>
          <NumberInput
            value={problemsPerSet}
            onChange={getDefaultChangeHandler('problemsPerSet')}
            min={1}
            max={1000}
          />
          Problems
        </div>
        <button
          onClick={onNewSet}
          className='mx-auto select-none rounded-lg bg-cyan-800 px-3.5 py-2 text-2xl active:brightness-[0.85]'
        >
          New Set
        </button>
      </div>
    </div>
  );
}

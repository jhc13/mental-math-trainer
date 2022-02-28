import { Fragment, useEffect, useState } from 'react';
import { OPERATORS, formatCentiseconds, formatTimestamp } from 'utils/format';

export default function PersonalRecords({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (records) {
      setSelectedRecord(records.slice(-1)[0]);
    }
  }, [records]);

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  return (
    <div className='grid justify-items-center gap-y-6 sm:grid-cols-2'>
      <div className='flex flex-col items-center gap-1'>
        <div className='text-lg font-medium'>Personal records</div>
        <div
          className={`${
            records === undefined || records.length === 0
              ? ''
              : 'grid-cols-[auto_auto]'
          } grid w-fit gap-x-6 gap-y-0.5 text-xl tabular-nums`}
        >
          {records === undefined
            ? '...'
            : records.length === 0
            ? 'None'
            : records.map((record, i) => (
                <Fragment key={i}>
                  <div
                    onClick={() => handleRecordClick(record)}
                    className={`${
                      record === selectedRecord ? 'text-sky-300' : ''
                    } cursor-pointer first-letter:uppercase`}
                  >
                    {record.problemCount === 1
                      ? 'single'
                      : `${record.calculationMethod.toLowerCase()} of ${
                          record.problemCount
                        }`}
                    :
                  </div>
                  <div
                    onClick={() => handleRecordClick(record)}
                    className={`${
                      record === selectedRecord ? 'text-sky-300' : ''
                    } cursor-pointer`}
                  >
                    {formatCentiseconds(record.centiseconds)}
                  </div>
                </Fragment>
              ))}
        </div>
      </div>
      <div className='flex max-h-[11.5rem] w-full flex-col items-center overflow-auto text-lg sm:max-h-[24.5rem]'>
        {selectedRecord && (
          <>
            <div className='font-medium text-sky-300'>
              {formatTimestamp(selectedRecord.timestamp)}
            </div>
            <div className='grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2.5 tabular-nums'>
              {selectedRecord.problems.map((problem, i) => (
                <Fragment key={i}>
                  <div
                    className={`${
                      selectedRecord.excludedProblems.some(
                        (excludedProblem) => excludedProblem.id === problem.id
                      )
                        ? 'text-zinc-500 line-through'
                        : 'text-sky-300'
                    } text-right`}
                  >
                    {i + 1}.
                  </div>
                  <div
                    className={
                      selectedRecord.excludedProblems.some(
                        (excludedProblem) => excludedProblem.id === problem.id
                      )
                        ? 'text-zinc-500'
                        : 'text-sky-300'
                    }
                  >
                    {problem.operands[0]}
                    {OPERATORS[problem.operation]}
                    {problem.operands[1]}:{' '}
                    {formatCentiseconds(problem.centiseconds)}
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

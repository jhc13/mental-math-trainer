import { Fragment } from 'react';
import { formatCentiseconds } from 'utils/format';

export default function PersonalRecords({ records }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='text-lg font-medium'>Personal records</div>
      <div
        className={`${
          records === undefined || records.length === 0
            ? ''
            : 'grid-cols-[auto_auto]'
        } grid w-fit  gap-x-6 gap-y-0.5 text-xl`}
      >
        {records === undefined
          ? '...'
          : records.length === 0
          ? 'None'
          : records.map((record, i) => (
              <Fragment key={i}>
                <div className='first-letter:uppercase'>
                  {record.problemCount === 1
                    ? 'single'
                    : `${record.calculationMethod.toLowerCase()} of ${
                        record.problemCount
                      }`}
                  :
                </div>
                {formatCentiseconds(record.centiseconds)}
              </Fragment>
            ))}
      </div>
    </div>
  );
}

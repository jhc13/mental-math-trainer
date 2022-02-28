import { formatCentiseconds } from '../utils/format';

export default function PersonalRecords({ records }) {
  const recordElements = [];
  if (records === undefined) {
    recordElements.push('...');
  } else if (records.length === 0) {
    recordElements.push('None');
  } else {
    for (const [i, record] of records.entries()) {
      recordElements.push(
        <div key={2 * i} className='first-letter:uppercase'>
          {record.problemCount === 1
            ? 'single'
            : `${record.calculationMethod.toLowerCase()} of ${
                record.problemCount
              }`}
          :
        </div>
      );
      recordElements.push(
        <div key={2 * i + 1}>{formatCentiseconds(record.centiseconds)}</div>
      );
    }
  }

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
        {recordElements}
      </div>
    </div>
  );
}

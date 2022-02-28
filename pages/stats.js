import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { getSession, useSession } from 'next-auth/react';
import { SettingsContext } from 'utils/settings';
import { formatSeconds, OPERATORS, pluralize } from '/utils/format';
import { getOperandLengths } from 'utils/utils';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Listbox from 'components/Listbox';
import PersonalRecords from 'components/PersonalRecords';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/sign-in?callbackUrl=${context.resolvedUrl}`,
        permanent: false
      }
    };
  }
  return {
    props: {
      session
    }
  };
}

function ProblemTypeSelector({
  operation,
  setOperation,
  operandLengths,
  setOperandLengths
}) {
  useEffect(() => {
    if (
      ['SUBTRACTION', 'DIVISION'].includes(operation) &&
      operandLengths[1] > operandLengths[0]
    ) {
      setOperandLengths([operandLengths[0], operandLengths[0]]);
    }
  }, [operation, operandLengths, setOperandLengths]);

  return (
    <div className='grid grid-cols-[7rem_4.5rem_7rem] gap-3'>
      <Listbox
        value={operandLengths[0]}
        onChange={(value) => {
          setOperandLengths([value, operandLengths[1]]);
        }}
        optionValues={getOperandLengths()}
        optionNames={getOperandLengths().map((length) =>
          pluralize('digit', length)
        )}
      />
      <Listbox
        value={operation}
        onChange={setOperation}
        optionValues={Object.keys(OPERATORS)}
        optionNames={Object.values(OPERATORS)}
      />
      <Listbox
        value={operandLengths[1]}
        onChange={(value) => {
          setOperandLengths([operandLengths[0], value]);
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
  );
}

export default function Stats() {
  const { data: session } = useSession();
  const router = useRouter();
  const { settings } = useContext(SettingsContext);
  const { operandLengths: operandLengthsSetting, operation: operationSetting } =
    settings;
  const [operation, setOperation] = useState(operationSetting);
  const [operandLengths, setOperandLengths] = useState(operandLengthsSetting);
  const { data: totalData } = useSWR(
    session ? `/api/users/${session.user.id}/stats` : null
  );
  const { data: problemTypeData } = useSWR(
    session
      ? `/api/users/${
          session.user.id
        }/stats?operation=${operation}&operandLengths=${JSON.stringify(
          operandLengths
        )}`
      : null
  );

  if (!session) {
    router.reload();
    return null;
  }

  return (
    <>
      <Head>
        <title>Stats – Mental Math Trainer</title>
        <meta
          name='description'
          content='View your stats, personal records and improvement over time.'
        />
      </Head>
      <div className='mx-4 my-8 flex flex-col gap-5 sm:gap-12'>
        <h1 className='text-center text-2xl font-semibold'>Stats</h1>
        <div className='mx-4 grid justify-items-center gap-y-4 sm:grid-cols-2'>
          <div className='text-center sm:justify-self-start'>
            <div className='text-lg font-medium'>
              Total number of problems solved
            </div>
            <div className='text-3xl font-medium'>
              {totalData ? totalData.totalProblemCount : '...'}
            </div>
          </div>
          <div className='text-center sm:justify-self-end'>
            <div className='text-lg font-medium'>Total time spent solving</div>
            <div className='text-3xl font-medium'>
              {totalData
                ? formatSeconds(
                    Math.floor(totalData.totalCentiseconds / 100),
                    true
                  )
                : '...'}
            </div>
          </div>
        </div>
        <div role='separator' className='h-px bg-zinc-300' />
        <div className='mx-4 flex flex-col gap-5 sm:gap-12'>
          <div className='flex flex-col gap-x-3 gap-y-1 self-center sm:flex-row sm:items-center'>
            <div className='text-lg font-medium'>Stats for</div>
            <ProblemTypeSelector
              {...{
                operation,
                setOperation,
                operandLengths,
                setOperandLengths
              }}
            />
          </div>
          <div className='grid justify-items-center gap-y-4 sm:grid-cols-2'>
            <div className='text-center sm:justify-self-start'>
              <div className='text-lg font-medium'>
                Number of problems solved
              </div>
              <div className='text-3xl font-medium'>
                {problemTypeData ? problemTypeData.problemCount : '...'}
              </div>
            </div>
            <div className='text-center sm:justify-self-end'>
              <div className='text-lg font-medium'>Time spent solving</div>
              <div className='text-3xl font-medium'>
                {problemTypeData
                  ? formatSeconds(
                      Math.floor(problemTypeData.centiseconds / 100),
                      true
                    )
                  : '...'}
              </div>
            </div>
          </div>
          <PersonalRecords records={problemTypeData?.records} />
        </div>
      </div>
    </>
  );
}

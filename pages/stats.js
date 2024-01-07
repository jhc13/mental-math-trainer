import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { RefreshIcon } from '@heroicons/react/outline';
import { SettingsContext } from 'utils/settings';
import { formatSeconds, OPERATORS, pluralize } from 'utils/format';
import { getOperandLengths } from 'utils/utils';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Listbox from 'components/Listbox';
import PersonalRecords from 'components/PersonalRecords';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

// The zoom plugin requires dynamic import.
const RecordProgressionsChart = dynamic(
  () => import('components/RecordProgressionsChart'),
  { ssr: false }
);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
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

export default function Stats() {
  const { data: session } = useSession();
  const router = useRouter();
  const { settings } = useContext(SettingsContext);
  const { operandLengths: operandLengthsSetting, operation: operationSetting } =
    settings;
  const [operation, setOperation] = useState(operationSetting);
  const [operandLengths, setOperandLengths] = useState(operandLengthsSetting);
  const [isResetProblemTypeDialogOpen, setIsResetProblemTypeDialogOpen] =
    useState(false);
  const [isResetAllDialogOpen, setIsResetAllDialogOpen] = useState(false);
  const { data: totalData, mutate: totalMutate } = useSWR(
    session ? `/api/users/${session.user.id}/stats` : null
  );
  const { data: problemTypeData, mutate: problemTypeMutate } = useSWR(
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

  function Divider() {
    return <div role='separator' className='h-px bg-zinc-300' />;
  }

  // \u00a0: non-breaking space
  const problemType = `${pluralize('digit', operandLengths[0], true)}\u00a0${
    OPERATORS[operation]
  }\u00a0${pluralize('digit', operandLengths[1], true)}`;

  return (
    <>
      <Head>
        <title>Stats – Mental Math Trainer</title>
        <meta
          name='description'
          content='View your stats, personal records and improvement over time.'
        />
      </Head>
      <div className='mx-4 my-8 flex flex-col gap-5 sm:gap-8'>
        <h1 className='text-center text-2xl font-semibold'>Stats</h1>
        <div className='grid justify-items-center gap-y-3 tabular-nums sm:grid-cols-2'>
          <div className='text-center'>
            <div className='text-lg'>Total number of problems solved</div>
            <div className='text-2xl font-medium'>
              {totalData ? totalData.totalProblemCount : '...'}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-lg'>Total time spent solving</div>
            <div className='text-2xl font-medium'>
              {totalData
                ? formatSeconds(
                    Math.floor(totalData.totalCentiseconds / 100),
                    true
                  )
                : '...'}
            </div>
          </div>
        </div>
        <Divider />
        <div className='flex flex-col gap-5 sm:gap-8'>
          <div className='flex flex-col gap-x-3 gap-y-1 self-center sm:flex-row sm:items-center'>
            <div className='text-xl font-medium'>Stats for</div>
            <ProblemTypeSelector
              {...{
                operation,
                setOperation,
                operandLengths,
                setOperandLengths
              }}
            />
          </div>
          <div className='grid justify-items-center gap-y-3 tabular-nums sm:grid-cols-2'>
            <div className='text-center'>
              <div className='text-lg'>Number of problems solved</div>
              <div className='text-2xl font-medium'>
                {problemTypeData ? problemTypeData.problemCount : '...'}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-lg'>Time spent solving</div>
              <div className='text-2xl font-medium'>
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
        {problemTypeData?.recordProgressions.length > 0 && (
          <RecordProgressionsChart
            progressions={problemTypeData.recordProgressions}
          />
        )}
        <Divider />
        <div className='flex select-none flex-col gap-3.5'>
          <button
            onClick={() => {
              setIsResetProblemTypeDialogOpen(true);
            }}
            className='flex w-fit items-center gap-2 rounded-md bg-red-900 px-3 py-2 active:brightness-[0.85]'
          >
            <RefreshIcon className='h-5 w-5' />
            Reset stats for {problemType}
          </button>
          <ConfirmationDialog
            isOpen={isResetProblemTypeDialogOpen}
            setIsOpen={setIsResetProblemTypeDialogOpen}
            title={`Reset stats for ${problemType}`}
            description={`Are you sure you want to delete your solved problems and personal records data for ${problemType}? This action cannot be undone.`}
            action='Reset stats'
            onAction={async () => {
              await fetch(
                `/api/users/${
                  session.user.id
                }/problems?operation=${operation}&operandLengths=${JSON.stringify(
                  operandLengths
                )}`,
                {
                  method: 'DELETE'
                }
              );
              await totalMutate();
              await problemTypeMutate();
            }}
          />
          <button
            onClick={() => {
              setIsResetAllDialogOpen(true);
            }}
            className='flex w-fit items-center gap-2 rounded-md bg-red-900 px-3 py-2 active:brightness-[0.85]'
          >
            <RefreshIcon className='h-5 w-5' />
            Reset all stats
          </button>
          <ConfirmationDialog
            isOpen={isResetAllDialogOpen}
            setIsOpen={setIsResetAllDialogOpen}
            title='Reset all stats'
            description='Are you sure you want to delete your solved problems and personal records data for all problem types? This action cannot be undone.'
            action='Reset all stats'
            onAction={async () => {
              await fetch(`/api/users/${session.user.id}/problems`, {
                method: 'DELETE'
              });
              await totalMutate();
              await problemTypeMutate();
            }}
          />
        </div>
      </div>
    </>
  );
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

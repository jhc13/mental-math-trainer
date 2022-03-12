import Head from 'next/head';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SettingsContext } from 'utils/settings';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Set from 'components/Set';
import Intermission from 'components/Intermission';

export default function Trainer() {
  const [isSolving, setIsSolving] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { status: sessionStatus } = useSession();
  const { settings } = useContext(SettingsContext);
  const { operation, operandLengths, setProblemCount } = settings;

  // Abort if the user signs out during a set.
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      setIsSolving(false);
    }
  }, [sessionStatus]);

  // Abort if the set settings change (in another tab).
  // Adding the operandLengths array directly as a dependency causes unintended
  // aborts.
  const [firstOperandLength, secondOperandLength] = operandLengths;
  useEffect(() => {
    setIsSolving(false);
  }, [operation, firstOperandLength, secondOperandLength, setProblemCount]);

  const handleSetEnd = useCallback(() => {
    setIsSolving(false);
  }, []);

  const handleNewSet = () => {
    setSolvedProblems([]);
    setIsSolving(true);
  };

  return (
    <>
      <Head>
        <title>Mental Math Trainer</title>
        <meta
          name='description'
          content={`Train your mental math skills with problems customizable from 1 to ${MAX_OPERAND_LENGTH} digits. Save your solve times and keep track of your records and progress.`}
        />
      </Head>
      {isSolving ? (
        <Set
          solvedProblems={solvedProblems}
          setSolvedProblems={setSolvedProblems}
          onSetEnd={handleSetEnd}
        />
      ) : (
        <Intermission problems={solvedProblems} onNewSet={handleNewSet} />
      )}
    </>
  );
}

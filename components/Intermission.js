import SetResults from 'components/SetResults';
import NewSetButtons from 'components/NewSetButtons';

export default function Intermission({ problems, onNewSet }) {
  return (
    <div className='mt-5 flex flex-col gap-10'>
      {problems && <SetResults problems={problems} />}
      <NewSetButtons onNewSet={onNewSet} />
    </div>
  );
}

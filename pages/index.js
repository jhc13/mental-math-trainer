import Keypad from 'components/Keypad';

function Home() {
  return (
    <Keypad
      pressKey={(keyText) => {
        console.log(keyText);
      }}
    />
  );
}

export default Home;

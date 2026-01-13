import SnakesGame from './snakes/components/SnakesGame';

export const metadata = {
  title: 'Bear Dice',
  description: 'Roll the dice to collect multipliers - but avoid the bear!',
};

export default function Home() {
  return <SnakesGame />;
}

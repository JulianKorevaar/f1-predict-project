import { useRouter } from 'next/router';

import { Background } from '../components/background/Background';
import { HeroOneButton } from '../components/hero/HeroOneButton';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { Section } from '../layout/Section';
import { Results2023 } from '../utils/AppConfig';

const Hero = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/explore');
  };

  return (
    <Background color="linear-gradient(to bottom, #0F172A, #020617)">
      <Section yPadding="pt-40 pb-16">
        <HeroOneButton
          title={
            <>
              {'Voorspel de kwalificatie en race uitslag\n'}
              <span className="text-primary-100">F1 2024</span>
            </>
          }
          description="Wees de beste voorspeller."
          button={
            <button
              type="submit"
              className="w-1/2 px-4 py-3 border rounded-md border-transparent text-base font-bold text-white bg-sky-500 hover:bg-sky-600 md:py-4 md:text-lg md:px-10"
              onClick={handleButtonClick}
            >
              Start met voorspellen
            </button>
          }
        />
      </Section>
      <Section>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl text-gray-100 font-bold whitespace-pre-line leading-hero">
            {'Uitslag Seizoen 2023'}
          </h1>
          <Leaderboard results={Results2023} />
        </div>
      </Section>
    </Background>
  );
};

export { Hero };

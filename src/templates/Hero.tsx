import { useRouter } from 'next/router';

import { Background } from '../components/background/Background';
import { HeroOneButton } from '../components/hero/HeroOneButton';
import { Section } from '../layout/Section';

const Hero = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/explore');
  };

  return (
    <Background color="bg-gray-100">
      <Section yPadding="pt-20 pb-32">
        <HeroOneButton
          title={
            <>
              {'Voorspel de kwalificatie en race uitslag\n'}
              <span className="text-primary-500">F1 2023</span>
            </>
          }
          description="Wees de beste voorspeller."
          button={
            <button
              type="submit"
              className="w-1/2 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
              onClick={handleButtonClick}
            >
              Start met voorspellen
            </button>
          }
        />
      </Section>
    </Background>
  );
};

export { Hero };

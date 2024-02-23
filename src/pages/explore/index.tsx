import { useState } from 'react';

import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { HeroOneInput } from '../../components/hero/HeroOneInput';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';
import { Section } from '../../layout/Section';
import { AppConfig } from '../../utils/AppConfig';

const LandingPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState<number>();
  const [error, setError] = useState('');

  const [areYouSure, setAreYouSure] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    setError('');

    if (name === '' || code === undefined) {
      setLoading(false);
      setError('Vul je naam en code in');
      return;
    }

    const res = await fetch(`/api/users/${name.toLowerCase()}-${code}`);
    const user = await res.json();

    if (user.length === 0) {
      if (!areYouSure) {
        setLoading(false);
        setError(
          'Deze gebruiker is niet gevonden. Als je een nieuwe gebruiker wilt aanmaken, klik dan nogmaals op de knop.'
        );
        setAreYouSure(true);
        return;
      }

      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim().toLowerCase(),
          code,
          points: 0,
        }),
      }).then(() => {
        localStorage.setItem('name', name.toLowerCase());
      });
    } else {
      localStorage.setItem('name', name.toLowerCase());
    }

    await router.push(`/predict/${AppConfig.current_race}`);
  };

  return (
    <Background
      color="linear-gradient(to bottom, #0F172A, #0F172A)"
      className="h-screen fixed inset-0"
    >
      <Section yPadding="pt-20 pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingIndicator />
          </div>
        ) : (
          <HeroOneInput
            title={<>{'Vul je naam in en code in\n'}</>}
            input={
              <>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Vul hier je naam in"
                  className="w-full px-4 py-3 border border-primary-700 rounded-xl shadow-sm focus:ring-primary-600 focus:border-primary-600 text-lg text-gray-50 placeholder-gray-600 text-center"
                  style={{ fontSize: '1.25rem', backgroundColor: '#1E293B' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
                <input
                  type="number"
                  name="code"
                  id="code"
                  placeholder="Vul hier je code in"
                  className="w-half mt-5 px-4 py-3 border border-primary-700 rounded-xl shadow-sm focus:ring-primary-600 focus:border-primary-600 text-lg text-gray-50 placeholder-gray-600 text-center"
                  style={{ fontSize: '1.25rem', backgroundColor: '#1E293B' }}
                  value={code}
                  onChange={(e) => setCode(Number(e.target.value))}
                ></input>
              </>
            }
            button={
              <button
                type="submit"
                className="w-1/2 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 md:py-4 md:text-lg md:px-10"
                onClick={handleButtonClick}
              >
                Start met voorspellen
              </button>
            }
          />
        )}
        <div className="text-center text-red-500">{error}</div>
      </Section>
    </Background>
  );
};

export default LandingPage;

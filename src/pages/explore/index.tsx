import { SetStateAction, useState } from 'react';

import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { HeroOneInput } from '../../components/hero/HeroOneInput';
import { Section } from '../../layout/Section';

const LandingPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState('');

  const handleButtonClick = async () => {
    setLoading(true);
    const res = await fetch(`/api/users/${name.toLowerCase()}`);
    const user = await res.json();

    if (user.length === 0) {
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.toLowerCase(),
          points: 0,
          current_gp: 0,
        }),
      }).then(() => {
        localStorage.setItem('name', name.toLowerCase());
      });
    } else {
      localStorage.setItem('name', name.toLowerCase());
    }

    await router.push('/predict');
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };

  return (
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <Section yPadding="pt-20 pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 6.627 5.373 12 12 12v-4zm5-5.291A7.962 7.962 0 0120 12h-4c0 3.042-1.135 5.824-3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <HeroOneInput
            title={<>{'Vul je naam in\n'}</>}
            input={
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Let op dat je je naam goed invult."
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                style={{ fontSize: '1.25rem' }}
                value={name}
                onChange={handleInputChange}
              ></input>
            }
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
        )}
      </Section>
    </Background>
  );
};

export default LandingPage;

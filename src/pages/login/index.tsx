import { useState } from 'react';

import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { PrimaryInput } from '../../components/input-field/InputField';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';

const LandingPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [areYouSure, setAreYouSure] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    setError('');

    if (name === '') {
      setLoading(false);
      setError('Vul je voor- en achternaam in.');
      return;
    }

    const res = await fetch(`/api/users/${name.trim().toLowerCase()}`);
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
          points: 0,
        }),
      }).then(() => {
        localStorage.setItem('name', name.trim().toLowerCase());
      });
    } else {
      localStorage.setItem('name', name.trim().toLowerCase());
    }

    await router.push(`/races`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleButtonClick();
    }
  };

  return (
    <Background
      color="linear-gradient(to bottom, #15141D, #15151E)"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div
            className="flex flex-col justify-center items-center min-h-screen gap-6"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            <LoadingIndicator />
            <p className="text-white text-lg font-f1bold animate-pulse">
              Inloggen...
            </p>
          </div>
        ) : (
          <div
            className="max-w-md mx-auto"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl font-f1bold text-white mb-4">
                F1 PREDICT
              </h1>
              <div className="flex justify-center gap-2 mb-6">
                <div className="h-1 w-8 bg-red-600 rounded-full" />
                <div className="h-1 w-8 bg-red-600 rounded-full animate-pulse" />
                <div className="h-1 w-8 bg-red-600 rounded-full" />
              </div>
              <p className="text-gray-300 text-sm tracking-widest uppercase">
                Voorspel en win
              </p>
            </div>

            {/* Card */}
            <div
              className="relative rounded-3xl p-8 sm:p-10 overflow-hidden shadow-2xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, rgba(25, 25, 40, 0.95) 0%, rgba(35, 35, 55, 0.95) 100%), 
                           url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/></pattern></defs><rect width="1000" height="1000" fill="url(%23grid)"/></svg>')`,
                backgroundSize: 'cover',
                animation:
                  'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              }}
            >
              {/* Background gradient accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-600 opacity-5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 opacity-5 rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative z-10">
                {/* Form Title */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-f1bold text-white mb-2">
                    Welkom
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Vul je voor- en achternaam in om te beginnen
                  </p>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <label className="block text-xs font-f1bold text-gray-300 uppercase tracking-widest mb-3">
                    Naam
                  </label>
                  <PrimaryInput
                    name="name"
                    id="name"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleButtonClick}
                  disabled={loading}
                  className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-f1bold text-base sm:text-lg rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 tracking-wide"
                >
                  Start met voorspellen
                </button>

                {/* Error Message */}
                {error && (
                  <div
                    className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                    style={{ animation: 'slideDown 0.3s ease-out' }}
                  >
                    <p className="text-red-400 text-sm font-medium text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    {areYouSure
                      ? 'Klik op de knop om je account aan te maken'
                      : 'Nieuw hier? Je account wordt automatisch aangemaakt'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="mt-12 text-center">
              <p className="text-xs text-gray-500 tracking-widest uppercase">
                Formula 1 Prediction Game
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Background>
  );
};

export default LandingPage;

import { useRouter } from 'next/router';

import { Background } from '../components/background/Background';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { Results2023, Results2024, Results2025 } from '../utils/AppConfig';

const Hero = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/login');
  };

  return (
    <Background color="linear-gradient(to bottom, #15141D, #15151E)">
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20 pt-20 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white font-f1bold tracking-wider">
              Voorspel de
            </h1>
            <img
              src="/assets/images/f1_logo.png"
              alt="F1 Logo"
              className="w-40 sm:w-48 h-10 sm:h-12 animate-pulse mt-2"
            />
          </div>

          {/* Decorative lines */}
          <div className="flex justify-center gap-3 mb-8">
            <div className="h-1 w-12 bg-red-600 rounded-full" />
            <div className="h-1 w-12 bg-red-600 rounded-full animate-pulse" />
            <div className="h-1 w-12 bg-red-600 rounded-full" />
          </div>

          <p className="text-lg sm:text-xl text-gray-300 font-f1regular mb-10 tracking-wide">
            Wees de beste voorspeller.
          </p>

          <button
            type="button"
            className="px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-f1bold text-base sm:text-lg rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:shadow-red-600/50 transform hover:scale-105 active:scale-95 tracking-wide"
            onClick={handleButtonClick}
          >
            Start met voorspellen
          </button>
        </div>

        {/* Leaderboards Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-slideUp">
            <h2 className="text-3xl sm:text-4xl font-f1bold text-white tracking-wide mb-4">
              Seizoen Uitslagen
            </h2>
            <div className="h-1 w-20 bg-red-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* 2025 Leaderboard */}
            <div
              className="flex flex-col items-center animate-slideUp"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="mb-6 text-center">
                <h3 className="text-2xl sm:text-3xl text-white font-f1bold mb-2 tracking-wide">
                  Seizoen 2025
                </h3>
                <div className="h-0.5 w-16 bg-yellow-500 rounded-full mx-auto" />
              </div>
              <div className="transform transition-all duration-300 hover:scale-105 w-full">
                <Leaderboard results={Results2025} />
              </div>
            </div>

            {/* 2024 Leaderboard */}
            <div
              className="flex flex-col items-center animate-slideUp"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="mb-6 text-center">
                <h3 className="text-2xl sm:text-3xl text-white font-f1bold mb-2 tracking-wide">
                  Seizoen 2024
                </h3>
                <div className="h-0.5 w-16 bg-gray-400 rounded-full mx-auto" />
              </div>
              <div className="transform transition-all duration-300 hover:scale-105 w-full">
                <Leaderboard results={Results2024} />
              </div>
            </div>

            {/* 2023 Leaderboard */}
            <div
              className="flex flex-col items-center animate-slideUp"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="mb-6 text-center">
                <h3 className="text-2xl sm:text-3xl text-white font-f1bold mb-2 tracking-wide">
                  Seizoen 2023
                </h3>
                <div className="h-0.5 w-16 bg-orange-600 rounded-full mx-auto" />
              </div>
              <div className="transform transition-all duration-300 hover:scale-105 w-full">
                <Leaderboard results={Results2023} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </Background>
  );
};

export { Hero };

import { useEffect, useState } from 'react';

import { Background } from '../../components/background/Background';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';
import { RaceTile } from '../../components/race/RaceTile';

type Race = {
  race: string;
  flag: string;
  date: string;
  track: string;
  number: number;
  bonus_question?: string;
  canceled?: boolean;
};

const RacesPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [races, setRaces] = useState<Race[]>([]);
  const [currentRaceNumber, setCurrentRaceNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/races');
        const data = await response.json();

        // Sort races by number and find current race
        const sortedRaces = data.sort(
          (a: Race, b: Race) => a.number - b.number
        );
        setRaces(sortedRaces);

        // Determine current race (latest not yet finished, or upcoming)
        const now = new Date();
        const currentRace = sortedRaces.find((race: Race) => {
          return new Date(race.date) > now;
        });

        if (currentRace) {
          setCurrentRaceNumber(currentRace.number);
        } else if (sortedRaces.length > 0) {
          // If all races are past, show the last one
          setCurrentRaceNumber(sortedRaces[sortedRaces.length - 1].number);
        }
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Sort races with current race at the top
  const sortedRacesForDisplay = [...races].sort((a, b) => {
    if (a.number === currentRaceNumber) return -1;
    if (b.number === currentRaceNumber) return 1;
    return a.number - b.number;
  });

  return (
    <Background
      color="linear-gradient(to bottom, #15141D, #15151E)"
      className="min-h-screen"
    >
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-f1bold text-white tracking-wide mb-2">
            F1 Races
          </h1>
          <div className="h-1 w-16 bg-red-600 rounded-full" />
        </div>

        {/* Loading State */}
        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="flex flex-col items-center gap-4">
              <LoadingIndicator />
              <p className="text-white text-lg font-f1bold animate-pulse">
                Loading races...
              </p>
            </div>
          </div>
        ) : races.length === 0 ? (
          <div className="flex justify-center items-center min-h-96">
            <p className="text-white text-xl font-f1bold">No races available</p>
          </div>
        ) : (
          /* Grid Layout - Responsive */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {sortedRacesForDisplay.map((race, index) => (
              <div
                key={race.number}
                className="animate-slideUp"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '0.6s',
                  animationFillMode: 'both',
                }}
              >
                <RaceTile
                  race={{
                    ...race,
                    flag: race.race,
                  }}
                  isCurrentRace={race.number === currentRaceNumber}
                />
              </div>
            ))}
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

        :global(.animate-fadeIn) {
          animation: fadeIn 0.5s ease-out;
        }

        :global(.animate-slideUp) {
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </Background>
  );
};

export default RacesPage;

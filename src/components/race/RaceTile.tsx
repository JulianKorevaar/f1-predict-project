import React from 'react';

import { useRouter } from 'next/router';

type IRaceTileProps = {
  race: {
    race: string;
    flag: string;
    date: string;
    track: string;
    number: number;
    bonus_question?: string;
    canceled?: boolean;
  };
  isCurrentRace: boolean;
};

const RaceTile = ({ race, isCurrentRace }: IRaceTileProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/predict/${race.number}`);
  };

  const raceDate = new Date(race.date);
  const formattedDate = raceDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={handleClick}
      className={`
        relative h-64 rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl
        ${isCurrentRace ? 'ring-4 ring-red-600 shadow-2xl' : 'shadow-lg'}
        group
      `}
      style={{
        background: `linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(30, 30, 50, 0.9) 100%), 
                     url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="1000" height="1000" fill="url(%23grid)"/></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Current race indicator */}
      {isCurrentRace && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent animate-pulse" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6 justify-between">
        {/* Top Left - Round Number */}
        <div className="flex-shrink-0">
          <p className="text-sm font-f1bold text-gray-400 tracking-widest uppercase">
            Ronde {race.number}
          </p>
        </div>

        {/* Center - Flag and Race Name */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className={'flex flex-row items-center gap-2'}>
            {race.flag && (
              <img
                src={`/assets/images/${race.flag}.png`}
                alt={race.race}
                className="h-8 w-12 object-cover rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-110"
              />
            )}
            <h3 className="text-2xl font-f1bold text-white text-center tracking-wide drop-shadow-lg">
              {race.race}
            </h3>
          </div>
          {race.track && (
            <p className="text-sm text-gray-300 text-center font-medium">
              {race.track}
            </p>
          )}
        </div>

        {/* Bottom Left - Date */}
        <div className="flex-shrink-0 flex items-end justify-between">
          <div className="group/date">
            <p className="text-xs text-gray-400 tracking-widest uppercase">
              Deadline
            </p>
            <p className="text-lg font-f1bold text-white transition-colors duration-300 group-hover/date:text-red-400">
              {formattedDate}
            </p>
          </div>

          {/* Current Race Badge */}
          {isCurrentRace && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-f1bold animate-pulse">
              CURRENT
            </div>
          )}
        </div>
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0" />
    </div>
  );
};

export { RaceTile };

import React from 'react';

type ResultUser = {
  name: string;
  points: number;
  movement?: number;
};

type ILeaderboardProps = {
  results: ResultUser[];
};

const Leaderboard = ({ results }: ILeaderboardProps) => {
  return (
    <div className="rounded-2xl shadow-lg mx-auto bg-white lg:min-w-[400px] sm:min-w-[300px]">
      {/* Added max-width and padding for responsiveness */}
      {results.map((result, index) => (
        <div
          key={result.name}
          className={`flex items-center justify-between pl-4
              ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}
              ${index !== results.length - 1 ? 'border-b border-white' : ''}
              rounded-lg`}
        >
          {/* Rank */}
          <span className="text-xl font-f1bold w-10 text-center text-black">
            {index + 1}
          </span>

          {/* Name */}
          <span className="text-lg font-f1bold flex-1 text-center text-black tracking-wide">
            {result.name
              .split(' ')
              .map((name, nameIndex, arr) => {
                if (nameIndex === 0) {
                  return (
                    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                  );
                }
                if (nameIndex === arr.length - 1) {
                  return name.toUpperCase();
                }
                return (
                  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                );
              })
              .join(' ')}
          </span>

          {/* Movement Indicator */}
          {result.movement !== undefined && result.movement !== 0 ? (
            <span
              className={`px-2 py-1 text-sm font-semibold rounded-md w-10 text-center text-white
                ${result.movement > 0 ? 'bg-green-500' : 'bg-red-600'}`}
            >
              {result.movement > 0 ? `+${result.movement}` : result.movement}
            </span>
          ) : (
            <span className="w-10"></span>
          )}

          {/* Points with different colors for top 3 */}
          <span
            className={`text-2xl font-f1bold font-semibold p-2 min-w-[80px] text-center 
              ${
                index === 0 && result.points > 0
                  ? 'bg-yellow-500 text-white'
                  : ''
              }
              ${
                index === 1 && result.points > 0 ? 'bg-gray-500 text-white' : ''
              }
              ${
                index === 2 && result.points > 0
                  ? 'bg-orange-800 text-white'
                  : ''
              }
              ${index > 2 || result.points <= 0 ? 'bg-red-600' : ''}
              ${index === 0 ? 'rounded-tr-lg' : ''}
              ${index === results.length - 1 ? 'rounded-br-lg' : ''}`}
          >
            {result.points}
          </span>
        </div>
      ))}
    </div>
  );
};

export { Leaderboard };

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
    <div className="rounded-2xl shadow-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden border border-gray-700 lg:min-w-[400px] sm:min-w-[300px] transition-all duration-300">
      {results.map((result, index) => (
        <div
          key={result.name}
          className={`flex items-center justify-between pl-4 transition-all duration-200 hover:bg-opacity-80
              ${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/50'}
              ${
                index !== results.length - 1
                  ? 'border-b border-gray-600/30'
                  : ''
              }`}
        >
          {/* Rank */}
          <span
            className={`text-xl font-f1bold w-10 text-center
              ${index === 0 ? 'text-yellow-400' : ''}
              ${index === 1 ? 'text-gray-300' : ''}
              ${index === 2 ? 'text-orange-400' : ''}
              ${index > 2 ? 'text-gray-400' : ''}`}
          >
            {index + 1}
          </span>

          {/* Name */}
          <span className="text-lg font-f1bold flex-1 text-center text-white tracking-wide">
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
              className={`px-2 py-1 text-sm font-f1bold rounded-md w-10 text-center text-white shadow-md
                ${result.movement > 0 ? 'bg-green-500' : 'bg-red-600'}`}
            >
              {result.movement > 0 ? `+${result.movement}` : result.movement}
            </span>
          ) : (
            <span className="w-10"></span>
          )}

          {/* Points with different colors for top 3 */}
          <span
            className={`text-2xl font-f1bold font-semibold p-3 min-w-[80px] text-center transition-all duration-200
              ${
                index === 0 && result.points > 0
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/30'
                  : ''
              }
              ${
                index === 1 && result.points > 0
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30'
                  : ''
              }
              ${
                index === 2 && result.points > 0
                  ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white shadow-lg shadow-orange-600/30'
                  : ''
              }
              ${
                index > 2 || result.points <= 0
                  ? 'bg-gradient-to-br from-red-600 to-red-800 text-white'
                  : ''
              }
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

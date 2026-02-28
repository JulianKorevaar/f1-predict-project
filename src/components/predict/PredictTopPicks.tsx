import { ReactNode } from 'react';

type IPredictTopPicksProps = {
  type: string;
  picks: ReactNode[];
  bonusPick?: ReactNode;
  onSubmit?: () => void;
};

const PredictTopPicks = (props: IPredictTopPicksProps) => {
  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  return (
    <div className="text-center max-w-3xl mx-auto mt-10">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl text-gray-50 font-bold font-f1bold tracking-wide mb-2">
          {props.type}
        </h1>
        <div className="h-1 w-16 bg-red-600 rounded-full mx-auto" />
      </div>

      <div className="space-y-2">
        {props.picks.map((pick, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <h2 className="font-f1regular text-gray-400 text-lg mb-3">
              {index + 1}e Plaats
            </h2>
            <div className="max-w-xl mx-auto">{pick}</div>
          </div>
        ))}
      </div>

      {props.bonusPick && (
        <div className="mt-12">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl text-gray-50 font-bold font-f1bold tracking-wide mb-2">
              Bonusvraag
            </h1>
            <div className="h-1 w-16 bg-yellow-500 rounded-full mx-auto" />
          </div>
          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-xl p-6 border-2 border-yellow-600/50">
            {props.bonusPick}
          </div>
        </div>
      )}

      {props.onSubmit && (
        <button
          type="submit"
          className="w-full max-w-xl mx-auto mt-10 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-f1bold text-lg rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={handleSubmit}
        >
          Voorspellen
        </button>
      )}
    </div>
  );
};

export { PredictTopPicks };

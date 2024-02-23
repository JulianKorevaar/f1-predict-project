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
    <header className="text-center">
      <h1 className="text-5xl text-gray-50 font-bold whitespace-pre-line leading-hero">
        {props.type}
      </h1>
      {props.picks.map((pick, index) => (
        <div key={index}>
          <br /> {/* You might adjust spacing according to your design */}
          <h2 className="text-gray-400 text-">{`${index + 1}e Plaats`}</h2>
          {pick}
          <br />
        </div>
      ))}
      <br />
      {props.bonusPick && (
        <>
          <h1 className="text-5xl text-gray-50 font-bold whitespace-pre-line leading-hero">
            Bonusvraag
          </h1>
          <br />
          {props.bonusPick}
          <br />
        </>
      )}
      {props.onSubmit && (
        <button
          type="submit"
          className="w-full rounded-2xl max-w-xl mt-8 px-4 py-3 border border-transparent text-base font-medium rounded-2 text-white bg-sky-500 hover:bg-sky-600 md:py-4 md:text-lg md:px-10"
          onClick={handleSubmit}
        >
          Voorspellen
        </button>
      )}
    </header>
  );
};

export { PredictTopPicks };

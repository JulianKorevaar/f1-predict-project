import { ReactNode } from 'react';

type IHeroPredInfoProps = {
  back: ReactNode;
  race: ReactNode;
  flag: ReactNode;
  user: ReactNode;
  leftButton?: ReactNode;
  rightButton?: ReactNode;
};

const PredictionInfo = (props: IHeroPredInfoProps) => {
  return (
    <header className="text-center">
      <div className="text-2xl mt-4 mb-5">{props.back}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">{props.leftButton}</div>
        <div className="flex items-center justify-between">
          {props.flag}
          <h1 className="lg:text-4xl md:text-3xl sm:text-3xl xs:text-lg text-gray-900 font-bold whitespace-pre-line leading-gp">
            GP {props.race}
          </h1>
        </div>
        <div className="flex items-center">{props.rightButton}</div>
      </div>
      <div className="text-2xl mt-4 mb-5">Voorspelling van: {props.user}</div>
    </header>
  );
};

export { PredictionInfo };

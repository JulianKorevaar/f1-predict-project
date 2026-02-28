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
    <div className="text-center">
      {/* Back Button */}
      <div className="mb-8 animate-fadeIn">{props.back}</div>

      {/* Navigation and Race Info */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex justify-start">{props.leftButton}</div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {props.flag}
            <h1 className="text-2xl md:text-4xl lg:text-5xl text-gray-50 font-bold font-f1bold tracking-wide">
              GP {props.race}
            </h1>
          </div>
        </div>

        <div className="flex-1 flex justify-end">{props.rightButton}</div>
      </div>

      {/* User Info */}
      <div className="mt-6">
        <div className="inline-block bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl px-6 py-3 border border-gray-700">
          <p className="text-gray-400 text-sm font-f1bold uppercase tracking-wider mb-1">
            Voorspelling van
          </p>
          <p className="text-white text-xl sm:text-2xl font-f1regular">
            {props.user}
          </p>
        </div>
      </div>
    </div>
  );
};

export { PredictionInfo };

import { ReactNode } from 'react';

import moment from 'moment';

type IHeroRaceInfoProps = {
  leaderBoard: ReactNode;
  race: ReactNode;
  flag: ReactNode;
  track: ReactNode;
  date: Date;
  leftButton?: ReactNode;
  rightButton?: ReactNode;
};

const PredictRaceInfo = (props: IHeroRaceInfoProps) => {
  // Create a new Date object for the deadline (1 day before the race date)
  const deadline = moment(props.date).subtract(1, 'days').toDate();
  deadline.setHours(5, 59, 59, 59);

  return (
    <div className="text-center mb-12">
      {/* Leaderboard Button */}
      <div className="mb-8 animate-fadeIn">{props.leaderBoard}</div>

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

      {/* Track and Date Info */}
      <div className="space-y-2">
        <div className="text-gray-300 text-xl sm:text-2xl font-f1bold">
          {props.track}
        </div>
        <div className="text-gray-400 text-base sm:text-lg">
          Race start:{' '}
          <span className="font-f1bold text-white">
            {moment(props.date)
              .subtract(2, 'hour')
              .local()
              .format('DD-MM-YYYY HH:mm')}
          </span>
        </div>
        <div className="text-red-500 font-f1bold text-sm sm:text-base">
          Deadline: {moment(deadline).format('DD-MM-YYYY HH:mm')}
        </div>
      </div>
    </div>
  );
};

export { PredictRaceInfo };

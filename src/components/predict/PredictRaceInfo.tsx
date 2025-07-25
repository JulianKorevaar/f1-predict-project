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
  // Create a new Date object for the deadline (2 days before the race date)
  const deadline = moment(props.date).subtract(1, 'days').toDate();
  deadline.setHours(11, 59, 59, 59);

  return (
    <header className="text-center">
      <div className="text-2xl mt-4 mb-5">{props.leaderBoard}</div>
      <div className="flex items-center justify-between">
        <div className="text-gray-100 flex items-center">
          {props.leftButton}
        </div>
        <div className="flex items-center justify-between">
          {props.flag}
          <h1 className="lg:text-4xl md:text-3xl sm:text-3xl xs:text-lg text-gray-50 font-bold whitespace-pre-line leading-gp">
            GP {props.race}
          </h1>
        </div>
        <div className="text-gray-100 flex items-center">
          {props.rightButton}
        </div>
      </div>
      <div className="text-gray-100 text-2xl mt-4">{props.track}</div>
      <div className="text-gray-100 text-l mb-1">
        Race start:{' '}
        {moment(props.date)
          .subtract(2, 'hour')
          .local()
          .format('DD-MM-YYYY HH:mm')}
      </div>
      <div className="text-red-500">
        (Deadline: {moment(deadline).format('DD-MM-YYYY HH:mm')})
      </div>
      <div className="text-2xl mt-4 mb-15"></div>
    </header>
  );
};

export { PredictRaceInfo };

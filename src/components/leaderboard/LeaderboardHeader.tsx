import { ReactNode } from 'react';

type ILeaderboardHeaderProps = {
  title: ReactNode;
};

const LeaderboardHeader = (props: ILeaderboardHeaderProps) => (
  <header className="text-center">
    <h1 className="text-4xl text-gray-50 whitespace-pre-line font-f1bold tracking-wider">
      {props.title}
    </h1>
  </header>
);

export { LeaderboardHeader };

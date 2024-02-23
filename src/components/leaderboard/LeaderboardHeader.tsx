import { ReactNode } from 'react';

type ILeaderboardHeaderProps = {
  title: ReactNode;
};

const LeaderboardHeader = (props: ILeaderboardHeaderProps) => (
  <header className="text-center">
    <h1 className="text-5xl text-gray-50 font-bold whitespace-pre-line leading-hero">
      {props.title}
    </h1>
  </header>
);

export { LeaderboardHeader };

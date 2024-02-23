import { useEffect, useState } from 'react';

import 'chart.js/auto';

import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';

import { Background } from '../../components/background/Background';
import { Leaderboard as LeaderboardComponent } from '../../components/leaderboard/Leaderboard';
import { LeaderboardHeader } from '../../components/leaderboard/LeaderboardHeader';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';
import { Section } from '../../layout/Section';
import { AppConfig } from '../../utils/AppConfig';

type IUserProps = {
  name: string;
  points: number;
};

type IRaceProps = {
  race: string;
  flag: string;
  track: string;
  date: Date;
  bonus_question?: string;
  canceled?: boolean;
  number: number;
};

type IDataProps = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

const Leaderboard = () => {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [data, setData] = useState<IDataProps>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const usersData = await res.json();

      const raceRes = await fetch(`/api/races`);
      const raceData = await raceRes.json();

      const progressUserRes = await fetch(`/api/progress`);
      const progressUserData = await progressUserRes.json();

      console.log(
        progressUserData
          .filter((user: any) => user.name === 'julian')
          .map((user: any) => user.points)
      );

      setUsers(usersData);
      setData({
        labels: raceData.map((race: IRaceProps) => race.race),
        datasets: usersData.map((user: IUserProps, index: number) => ({
          id: index,
          label: user.name,
          pointRadius: 5,
          pointHoverRadius: 10,
          data: progressUserData
            .filter((progressUser: any) => progressUser.name === user.name)
            .map((progressUser: any) => progressUser.points) || [user.points],
        })),
      });
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const router = useRouter();

  const handleGoBack = () => {
    router.push(`/predict/${AppConfig.current_race}`);
  };

  return (
    <Background
      color="linear-gradient(to bottom, #0F172A, #0F172A)"
      className="h-screen fixed inset-0"
    >
      <div className="overflow-y-auto h-full">
        <Section yPadding="pt-20 pb-32">
          <LeaderboardHeader title={<>{'Huidige Tussenstand\n'}</>} />
          <br />
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingIndicator />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <LeaderboardComponent results={sortedUsers} />
              <button
                onClick={handleGoBack}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Terug naar voorspellingen
              </button>
            </div>
          )}
        </Section>
        {!loading && (
          <Line
            data={data}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              maintainAspectRatio: false,
            }}
          />
        )}
      </div>
    </Background>
  );
};

export default Leaderboard;

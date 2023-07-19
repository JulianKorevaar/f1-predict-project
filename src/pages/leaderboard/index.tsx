import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { LeaderboardHeader } from '../../components/leaderboard/LeaderboardHeader';
import { Section } from '../../layout/Section';
import { AppConfig } from '../../utils/AppConfig';

type IUserProps = {
  name: string;
  points: number;
  current_gp: number;
};

const Leaderboard = () => {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const usersData = await res.json();
      setUsers(usersData);
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
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <div className="overflow-y-auto h-full">
        <Section yPadding="pt-20 pb-32">
          <LeaderboardHeader title={<>{'Huidige Tussenstand\n'}</>} />
          <br />
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 6.627 5.373 12 12 12v-4zm5-5.291A7.962 7.962 0 0120 12h-4c0 3.042-1.135 5.824-3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <table className="table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Positie</th>
                    <th className="px-4 py-2">Naam</th>
                    <th className="px-4 py-2">Punten</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={user.name}
                      className={`${
                        index === 0 && user.points > 0 ? 'bg-yellow-200' : ''
                      }`}
                    >
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {`${user.name}${
                          index === 0 && user.points > 0 ? ' 🥇' : ''
                        }`}
                      </td>
                      <td className="border px-4 py-2">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleGoBack}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Terug naar voorspellingen
              </button>
            </div>
          )}
        </Section>
      </div>
    </Background>
  );
};

export default Leaderboard;

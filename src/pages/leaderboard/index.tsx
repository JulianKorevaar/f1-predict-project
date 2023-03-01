import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { LeaderboardHeader } from '../../components/leaderboard/LeaderboardHeader';
import { Section } from '../../layout/Section';

type IProps = {
  users: [
    {
      name: string;
      points: number;
      current_gp: number;
    }
  ];
};

const Leaderboard: NextPage<IProps> = ({ users }) => {
  // Sort users in descending order based on their points
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const router = useRouter();

  const handleGoBack = () => {
    router.push('/predict');
  };

  return (
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <Section yPadding="pt-20 pb-32">
        <LeaderboardHeader title={<>{'Huidige Tussenstand\n'}</>} />
        <br />
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
      </Section>
    </Background>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const usersRequest = await fetch(`${process.env.API_URL}/users`);
  const users = await usersRequest.json();

  return {
    props: {
      users,
    },
  };
};

export default Leaderboard;

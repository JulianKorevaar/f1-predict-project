type ResultUser = {
  name: string;
  points: number;
};

type ILeaderboardProps = {
  results: ResultUser[];
};

const Leaderboard = (props: ILeaderboardProps) => (
  <table className="table-auto">
    <thead>
      <tr>
        <th className="text-gray-50 px-4 py-2">Positie</th>
        <th className="text-gray-50 px-4 py-2">Naam</th>
        <th className="text-gray-50 px-4 py-2">Punten</th>
      </tr>
    </thead>
    <tbody>
      {props.results.map((result, index) => (
        <tr
          key={result.name}
          className={`${
            index === 0 && result.points > 0 ? 'bg-yellow-500' : ''
          }`}
        >
          <td className="text-gray-50 border-2 px-4 py-2">{index + 1}</td>
          <td className="text-gray-50 border-2 px-4 py-2">
            {`${result.name}${index === 0 && result.points > 0 ? ' 🥇' : ''}`}
          </td>
          <td className="text-gray-50 border-2 px-4 py-2">{result.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export { Leaderboard };

import { SetStateAction, useEffect, useState } from 'react';

import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { PredictRaceInfo } from '../../components/predict/PredictRaceInfo';
import { PredictTopPicks } from '../../components/predict/PredictTopPicks';
import { Section } from '../../layout/Section';

type IRaceProps = {
  race: string;
  flag: string;
  track: string;
  date: Date;
  bonus_question?: string;
  number: number;
  predictions?: [
    {
      user: string;
      kwali: [number, number, number];
      race: [number, number, number];
      bonus: number;
      number: number;
    }
  ];
};

type IDriverProps = {
  name: string;
  racenumber: number;
};

const Predict = () => {
  const router = useRouter();
  let currentName: string | null;

  const [races, setRaces] = useState<IRaceProps[]>([]);
  useEffect(() => {
    const fetchRaces = async () => {
      const resRaces = await fetch(`/api/races`);
      const racesData = await resRaces.json();

      const permRaces = await Promise.all(
        racesData.map(async (race: { number: any }) => {
          const res = await fetch(`/api/prediction/${race.number}`);
          const permData = await res.json();

          return {
            ...race,
            predictions: permData,
          };
        })
      );

      setRaces(permRaces);
    };
    fetchRaces();
  }, []);

  const [drivers, setDrivers] = useState<IDriverProps[]>([]);
  useEffect(() => {
    const fetchDrivers = async () => {
      const resDrivers = await fetch(`/api/drivers`);
      const driversData = await resDrivers.json();

      setDrivers(driversData);
    };
    fetchDrivers();
  }, []);

  const [currentRace, setCurrentRace] = useState(0);

  if (typeof window !== 'undefined') {
    currentName = localStorage.getItem('name');
  }

  const [FIRST_PICK_Q, SET_FIRST_PICK_Q] = useState('');
  const [SECOND_PICK_Q, SET_SECOND_PICK_Q] = useState('');
  const [THIRD_PICK_Q, SET_THIRD_PICK_Q] = useState('');

  const [FIRST_PICK_R, SET_FIRST_PICK_R] = useState('');
  const [SECOND_PICK_R, SET_SECOND_PICK_R] = useState('');
  const [THIRD_PICK_R, SET_THIRD_PICK_R] = useState('');

  const [BONUS_PICK, SET_BONUS_PICK] = useState('');

  const openLeaderboard = () => {
    router.push('/leaderboard');
  };

  const handleSelectChangeFirst = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_FIRST_PICK_Q(event.target.value);
  };

  const handleSelectChangeSecond = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_SECOND_PICK_Q(event.target.value);
  };

  const handleSelectChangeThird = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_THIRD_PICK_Q(event.target.value);
  };

  const handleSelectChangeFirstR = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_FIRST_PICK_R(event.target.value);
  };

  const handleSelectChangeSecondR = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_SECOND_PICK_R(event.target.value);
  };

  const handleSelectChangeThirdR = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_THIRD_PICK_R(event.target.value);
  };

  const handleSelectChangeBonus = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_BONUS_PICK(event.target.value);
  };

  const handleButtonClick = async () => {
    const deadline = moment(races[currentRace]?.date)
      .subtract(2, 'days')
      .local() // convert to local time zone
      .toDate();
    deadline.setHours(0, 0, 0, 0);

    if (new Date() > deadline) {
      alert('Je hebt te laat ingezet!');
      return;
    }

    const kwaliSet = new Set([FIRST_PICK_Q, SECOND_PICK_Q, THIRD_PICK_Q]);
    const raceSet = new Set([FIRST_PICK_R, SECOND_PICK_R, THIRD_PICK_R]);

    if (kwaliSet.size !== 3 || raceSet.size !== 3) {
      alert(
        'Je kan niet meerdere (of geen) coureurs tegelijk selecteren voor de kwalificatie of race!'
      );
      return;
    }

    // post prediction
    await fetch('/api/createPrediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: currentName,
        kwali: [FIRST_PICK_Q, SECOND_PICK_Q, THIRD_PICK_Q],
        race: [FIRST_PICK_R, SECOND_PICK_R, THIRD_PICK_R],
        bonus: BONUS_PICK,
        number: currentRace + 1,
      }),
    }).then(() => {
      window.location.reload();
    });
  };

  const handlePreviousButtonClick = async () => {
    setCurrentRace(currentRace - 1);
  };

  const handleNextButtonClick = async () => {
    setCurrentRace(currentRace + 1);
  };

  const isPreviousButtonDisabled = () => {
    return currentRace === 0;
  };

  const isNextButtonDisabled = () => {
    return currentRace >= 22;
  };

  const getNameByDriverNumer = (number: number) => {
    return drivers.find((driver) => driver.racenumber === number)?.name;
  };

  return (
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <Section yPadding="pt-10 pb-32">
        <PredictRaceInfo
          leaderBoard={
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              type="submit"
              onClick={openLeaderboard}
            >
              Bekijk tussenstand
            </button>
          }
          race={races[currentRace]?.race}
          flag={
            <img
              src={`${router.basePath}/assets/images/${races[currentRace]?.race}.png`}
              alt="flag"
              style={{ maxWidth: '70px', maxHeight: '70px' }}
            />
          }
          track={races[currentRace]?.track}
          date={new Date(races[currentRace]?.date as unknown as string)}
          leftButton={
            !isPreviousButtonDisabled() ? (
              <button type="submit" onClick={handlePreviousButtonClick}>
                Vorige GP
              </button>
            ) : (
              <button
                type="submit"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Vorige GP
              </button>
            )
          }
          rightButton={
            !isNextButtonDisabled() ? (
              <button type="submit" onClick={handleNextButtonClick}>
                Volgende GP
              </button>
            ) : (
              <button
                type="submit"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Volgende GP
              </button>
            )
          }
        />
        {races[currentRace]?.predictions?.some(
          (prediction) => prediction.user === currentName
        ) ? (
          <div className="text-gray-500 text-sm text-center">
            Je hebt al gestemd voor deze race.
            {races[currentRace]?.predictions?.map((prediction) => {
              if (prediction.user === currentName) {
                return (
                  <Section key={prediction.number}>
                    <PredictTopPicks
                      type={'Kwalificatie'}
                      firstPick={getNameByDriverNumer(prediction.kwali[0])}
                      secondPick={getNameByDriverNumer(prediction.kwali[1])}
                      thirdPick={getNameByDriverNumer(prediction.kwali[2])}
                    />
                    <br></br>
                    <br></br>
                    <PredictTopPicks
                      type={'Race'}
                      firstPick={getNameByDriverNumer(prediction.race[0])}
                      secondPick={getNameByDriverNumer(prediction.race[1])}
                      thirdPick={getNameByDriverNumer(prediction.race[2])}
                      bonusPick={
                        races[currentRace]?.bonus_question ? (
                          <>
                            <h1> {races[currentRace]?.bonus_question} </h1>
                            <h1> {prediction.bonus} </h1>
                          </>
                        ) : null
                      }
                    ></PredictTopPicks>
                  </Section>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <>
            <PredictTopPicks
              type={'Kwalificatie'}
              firstPick={
                <select
                  name="first pick"
                  id="first"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={FIRST_PICK_Q}
                  onChange={handleSelectChangeFirst}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
              secondPick={
                <select
                  name="second pick"
                  id="second"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={SECOND_PICK_Q}
                  onChange={handleSelectChangeSecond}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
              thirdPick={
                <select
                  name="third pick"
                  id="third"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={THIRD_PICK_Q}
                  onChange={handleSelectChangeThird}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
            />
            <br></br>
            <br></br>
            <PredictTopPicks
              type={'Race'}
              firstPick={
                <select
                  name="first pick race"
                  id="first_race"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={FIRST_PICK_R}
                  onChange={handleSelectChangeFirstR}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
              secondPick={
                <select
                  name="second pick race"
                  id="second_race"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={SECOND_PICK_R}
                  onChange={handleSelectChangeSecondR}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
              thirdPick={
                <select
                  name="third pick race"
                  id="third_race"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                  style={{ fontSize: '1.25rem' }}
                  value={THIRD_PICK_R}
                  onChange={handleSelectChangeThirdR}
                >
                  <option value="">Selecteer een coureur</option>
                  {drivers.map((driver) => (
                    <option key={driver.name} value={driver.racenumber}>
                      {driver.name} # {driver.racenumber}
                    </option>
                  ))}
                </select>
              }
              bonusPick={
                races[currentRace]?.bonus_question && (
                  <>
                    <h1> {races[currentRace]?.bonus_question} </h1>
                    <br></br>
                    <input
                      type="number"
                      name="bonus pick"
                      id="bonus"
                      className="w-1/4 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
                      style={{ fontSize: '1.25rem' }}
                      value={BONUS_PICK}
                      onChange={handleSelectChangeBonus}
                    ></input>
                  </>
                )
              }
              submit={
                <button
                  type="submit"
                  className="w-1/4 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
                  onClick={handleButtonClick}
                >
                  Voorspel
                </button>
              }
            />
          </>
        )}
      </Section>
    </Background>
  );
};

export const getStaticProps: GetServerSideProps = async () => {
  const resRaces = await fetch(`${process.env.API_URL}/races`);
  const resDrivers = await fetch(`${process.env.API_URL}/drivers`);

  const races = await resRaces.json();
  const drivers = await resDrivers.json();

  const permRaces = await Promise.all(
    races.map(async (race: { number: any }) => {
      const res = await fetch(
        `${process.env.API_URL}/prediction/${race.number}`
      );
      const data = await res.json();

      return {
        ...race,
        predictions: data,
      };
    })
  );

  return {
    props: {
      races: permRaces,
      drivers,
    },
  };
};

export default Predict;

import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';

import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';
import { PredictRaceInfo } from '../../components/predict/PredictRaceInfo';
import { PredictTopPicks } from '../../components/predict/PredictTopPicks';
import { Section } from '../../layout/Section';
import { AppConfig } from '../../utils/AppConfig';

type IRaceProps = {
  race: string;
  flag: string;
  track: string;
  date: Date;
  bonus_question?: string;
  canceled?: boolean;
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

interface PageProps {
  raceId: number;
}

const Predict: NextPage<PageProps> = (props) => {
  const router = useRouter();

  let currentName: string | null;

  const [loading, setLoading] = useState<boolean>(true);
  const [currentRaceNumber, setCurrentRaceNumber] = useState<number>(0);

  const [race, setRace] = useState<IRaceProps>();
  const [drivers, setDrivers] = useState<IDriverProps[]>([]);

  const [BONUS_PICK, SET_BONUS_PICK] = useState('');
  const [kwaliPicks, setKwaliPickedValues] = useState<string[]>([]);
  const handleKwaliSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newPickedValues = [...kwaliPicks];
    newPickedValues[index] = e.target.value;
    setKwaliPickedValues(newPickedValues);
  };

  const [racePicks, setRacePickedValues] = useState<string[]>([]);
  const handleRaceSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newPickedValues = [...racePicks];
    newPickedValues[index] = e.target.value;
    setRacePickedValues(newPickedValues);
  };

  const picksKwali = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < AppConfig.amount_of_kwali_picks; i++) {
    picksKwali.push(
      <select
        name={`pick ${i + 1}`}
        id={`pick-${i + 1}`}
        className="w-full max-w-xl px-4 py-3 border border-primary-700 rounded-xl shadow-sm focus:ring-primary-600 focus:border-primary-600 text-lg text-gray-50 placeholder-gray-600 text-center"
        style={{
          fontSize: '1.25rem',
          backgroundColor: '#1E293B',
          textAlign: 'center',
        }}
        value={kwaliPicks[i]}
        onChange={(e) => handleKwaliSelectChange(e, i)}
      >
        <option className="text-center" value="">
          Selecteer een coureur
        </option>
        {drivers.map((driver) => (
          <option key={driver.name} value={driver.racenumber}>
            {driver.name} # {driver.racenumber}
          </option>
        ))}
      </select>
    );
  }

  const picksRace = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < AppConfig.amount_of_kwali_picks; i++) {
    picksRace.push(
      <select
        name={`pick ${i + 1}`}
        id={`pick-${i + 1}`}
        className="w-full max-w-xl px-4 py-3 border border-primary-700 rounded-xl shadow-sm focus:ring-primary-600 focus:border-primary-600 text-lg text-gray-50 placeholder-gray-600 text-center"
        style={{ fontSize: '1.25rem', backgroundColor: '#1E293B' }}
        value={racePicks[i]} // You need to manage the selected values
        onChange={(e) => handleRaceSelectChange(e, i)} // You need to manage the change event
      >
        <option value="">Selecteer een coureur</option>
        {drivers.map((driver) => (
          <option key={driver.name} value={driver.racenumber}>
            {driver.name} # {driver.racenumber}
          </option>
        ))}
      </select>
    );
  }

  useEffect(() => {
    const fetchRace = async () => {
      setCurrentRaceNumber(Number(props.raceId));

      const raceRes = await fetch(`/api/races/${props.raceId}`);
      const raceData = await raceRes.json();
      const predictionRes = await fetch(`/api/prediction/${props.raceId}`);
      const predictionData = await predictionRes.json();

      setRace({
        ...raceData[0],
        predictions: predictionData,
      });
      setLoading(false);
    };
    fetchRace();
  }, [props.raceId]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const resDrivers = await fetch(`/api/drivers`);
      const driversData = await resDrivers.json();

      setDrivers(driversData);
    };
    fetchDrivers();
  }, []);

  if (typeof window !== 'undefined') {
    currentName = localStorage.getItem('name');
  }

  const openLeaderboard = () => {
    router.push('/leaderboard');
  };

  const handleSelectChangeBonus = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    SET_BONUS_PICK(event.target.value);
  };

  const handlePredictButtonClick = async () => {
    const deadline = moment(race?.date)
      .subtract(1, 'days')
      .local() // convert to local time zone
      .toDate();
    deadline.setHours(7, 59, 59, 59);

    if (currentName === null || currentName === '') {
      alert('Je bent niet (goed) ingelogd, log alsjeblieft opnieuw in!');
      return;
    }

    if (new Date() > deadline) {
      alert('Je hebt te laat ingezet!');
      return;
    }

    const kwaliSet = new Set(kwaliPicks);
    const raceSet = new Set(racePicks);

    if (kwaliSet.size !== 3 || raceSet.size !== 3) {
      alert(
        'Je kan niet meerdere (of geen) coureurs tegelijk selecteren voor de kwalificatie of race!'
      );
      return;
    }

    // post prediction
    await fetch('/api/prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: currentName,
        kwali: [kwaliPicks[0], kwaliPicks[1], kwaliPicks[2]],
        race: [racePicks[0], racePicks[1], racePicks[2]],
        bonus: BONUS_PICK,
        number: currentRaceNumber,
      }),
    }).then(() => {
      window.location.reload();
    });
  };

  const handlePreviousButtonClick = async () => {
    const newRaceNumber = currentRaceNumber - 1;
    await router.push(`/predict/${newRaceNumber}`);
  };

  const handleNextButtonClick = async () => {
    // add one with Math class
    const newRaceNumber = Number(currentRaceNumber) + 1;
    await router.push(`/predict/${newRaceNumber}`);
  };

  const isPreviousButtonDisabled = () => {
    return currentRaceNumber === 1;
  };

  const isNextButtonDisabled = () => {
    return currentRaceNumber >= AppConfig.amount_of_races;
  };

  const getNameByDriverNumer = (number: number) => {
    return drivers.find((driver) => driver.racenumber === number)?.name;
  };

  const isRaceCanceled = race?.canceled;
  const hasPrediction = race?.predictions?.some(
    (prediction) => prediction.user === currentName
  );

  return (
    <Background
      color="linear-gradient(to bottom, #0F172A, #0F172A)"
      className="h-screen fixed inset-0"
    >
      <div className="overflow-y-auto h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingIndicator />
          </div>
        ) : (
          <Section yPadding="pt-10 pb-32">
            <PredictRaceInfo
              leaderBoard={
                <button
                  className="bg-red-600 hover:bg-red-700 font-f1regular text-white font-bold py-2 px-4 rounded-md mt-4"
                  type="submit"
                  onClick={openLeaderboard}
                >
                  Bekijk tussenstand
                </button>
              }
              race={race?.race}
              flag={
                <img
                  src={`${router.basePath}/assets/images/${race?.race}.png`}
                  alt="flag"
                  style={{ maxWidth: '70px', maxHeight: '70px' }}
                />
              }
              track={race?.track}
              date={new Date(race?.date as unknown as string)}
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
            {/* eslint-disable-next-line no-nested-ternary */}
            {!isRaceCanceled ? (
              hasPrediction ? (
                <div className="text-gray-50 text-sm text-center">
                  <h1> Je hebt al gestemd voor deze race. </h1>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    type="submit"
                    onClick={() =>
                      router.push(`/predict/result/${currentRaceNumber}`)
                    }
                  >
                    Bekijk andere voorspellingen
                  </button>
                  {race?.predictions?.map((prediction) => {
                    if (prediction.user === currentName) {
                      return (
                        <Section key={prediction.number}>
                          <PredictTopPicks
                            type={'Kwalificatie'}
                            picks={prediction.kwali.map((pick) =>
                              getNameByDriverNumer(pick)
                            )}
                          />
                          <br></br>
                          <br></br>
                          <PredictTopPicks
                            type={'Race'}
                            picks={prediction.race.map((pick) =>
                              getNameByDriverNumer(pick)
                            )}
                            bonusPick={
                              race?.bonus_question ? (
                                <>
                                  <h1> {race?.bonus_question} </h1>
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
                  <PredictTopPicks type={'Kwalificatie'} picks={picksKwali} />
                  <PredictTopPicks
                    type={'Race'}
                    picks={picksRace}
                    bonusPick={
                      race?.bonus_question && (
                        <>
                          <h1 className="text-gray-50">
                            {' '}
                            {race?.bonus_question}{' '}
                          </h1>
                          <br></br>
                          <input
                            type="number"
                            name="bonus pick"
                            id="bonus"
                            className="w-1/4 px-4 py-3 border border-primary-700 rounded-xl shadow-sm focus:ring-primary-600 focus:border-primary-600 text-lg text-gray-50 placeholder-gray-600 text-center"
                            style={{
                              fontSize: '1.25rem',
                              backgroundColor: '#1E293B',
                            }}
                            value={BONUS_PICK}
                            onChange={handleSelectChangeBonus}
                          ></input>
                        </>
                      )
                    }
                    onSubmit={handlePredictButtonClick}
                  />
                </>
              )
            ) : (
              <Section>
                <h1 className="text-2xl font-bold text-center text-gray-900">
                  Deze race is afgelast
                </h1>
              </Section>
            )}
          </Section>
        )}
      </div>
    </Background>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      raceId: query.race_id,
    },
  };
};

export default Predict;

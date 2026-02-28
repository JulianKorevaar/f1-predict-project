import { SetStateAction, useEffect, useState } from 'react';

import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { Dropdown } from '../../components/dropdown/Dropdown';
import { LoadingIndicator } from '../../components/loading/LoadingIndicator';
import { PredictRaceInfo } from '../../components/predict/PredictRaceInfo';
import { PredictTopPicks } from '../../components/predict/PredictTopPicks';
import { Toast } from '../../components/toast/Toast';
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
  const [kwaliPicks, setKwaliPickedValues] = useState<string[]>(['', '', '']);
  const [racePicks, setRacePickedValues] = useState<string[]>(['', '', '']);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const handleKwaliSelectChange = (value: string, index: number) => {
    const newPickedValues = [...kwaliPicks];
    newPickedValues[index] = value;
    setKwaliPickedValues(newPickedValues);
  };

  const handleRaceSelectChange = (value: string, index: number) => {
    const newPickedValues = [...racePicks];
    newPickedValues[index] = value;
    setRacePickedValues(newPickedValues);
  };

  const driverOptions = drivers.map((driver) => ({
    value: driver.racenumber,
    label: `${driver.name} #${driver.racenumber}`,
  }));

  const picksKwali = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < AppConfig.amount_of_kwali_picks; i++) {
    picksKwali.push(
      <Dropdown
        key={`kwali-${i}`}
        placeholder="Selecteer een coureur"
        value={kwaliPicks[i]}
        onChange={(e) => handleKwaliSelectChange(e.target.value, i)}
        options={driverOptions}
      />
    );
  }

  const picksRace = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < AppConfig.amount_of_kwali_picks; i++) {
    picksRace.push(
      <Dropdown
        key={`race-${i}`}
        placeholder="Selecteer een coureur"
        value={racePicks[i]}
        onChange={(e) => handleRaceSelectChange(e.target.value, i)}
        options={driverOptions}
      />
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
    deadline.setHours(14, 59, 59, 59);

    if (currentName === null || currentName === '') {
      setToast({
        message: 'Je bent niet (goed) ingelogd, log alsjeblieft opnieuw in!',
        type: 'error',
      });
      return;
    }

    if (new Date() > deadline) {
      setToast({
        message: 'Je hebt te laat ingezet!',
        type: 'error',
      });
      return;
    }

    const kwaliSet = new Set(kwaliPicks);
    const raceSet = new Set(racePicks);

    if (kwaliSet.size !== 3 || raceSet.size !== 3) {
      setToast({
        message:
          'Je kan niet meerdere (of geen) coureurs tegelijk selecteren voor de kwalificatie of race!',
        type: 'warning',
      });
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
      setToast({
        message: 'Je voorspelling is opgeslagen!',
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
      color="linear-gradient(to bottom, #15141D, #15151E)"
      className="min-h-screen"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="overflow-y-auto h-full">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
              <LoadingIndicator />
              <p className="text-white text-lg font-f1bold animate-pulse">
                Loading race...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
            <Section yPadding="pt-10 pb-32">
              <PredictRaceInfo
                leaderBoard={
                  <button
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-f1regular text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                    className="rounded-lg shadow-lg w-12 h-12 md:w-20 md:h-20  object-cover"
                  />
                }
                track={race?.track}
                date={new Date(race?.date as unknown as string)}
                leftButton={
                  !isPreviousButtonDisabled() ? (
                    <button
                      type="submit"
                      onClick={handlePreviousButtonClick}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-f1bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className={'hidden sm:inline'}>Vorige GP</div>
                      <div className={'inline sm:hidden'}>←</div>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={true}
                      className="bg-gray-800 text-gray-500 font-f1bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className={'hidden sm:inline'}>Vorige GP</div>
                      <div className={'inline sm:hidden'}>←</div>
                    </button>
                  )
                }
                rightButton={
                  !isNextButtonDisabled() ? (
                    <button
                      type="submit"
                      onClick={handleNextButtonClick}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-f1bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className={'hidden sm:inline'}>Volgende GP →</div>
                      <div className={'inline sm:hidden'}>→</div>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled
                      className="bg-gray-800 text-gray-500 font-f1bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className={'hidden sm:inline'}>Volgende GP →</div>
                      <div className={'inline sm:hidden'}>→</div>
                    </button>
                  )
                }
              />
              {/* eslint-disable-next-line no-nested-ternary */}
              {!isRaceCanceled ? (
                hasPrediction ? (
                  <div className="text-gray-50 text-sm text-center animate-slideUp">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border-2 border-gray-700 max-w-3xl mx-auto mt-8">
                      <h1 className="text-2xl font-f1bold mb-4 text-green-400">
                        ✓ Je hebt al gestemd voor deze race
                      </h1>
                      <button
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-f1regular text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                              <PredictTopPicks
                                type={'Race'}
                                picks={prediction.race.map((pick) =>
                                  getNameByDriverNumer(pick)
                                )}
                                bonusPick={
                                  race?.bonus_question ? (
                                    <>
                                      <h1 className="font-f1regular text-xl">
                                        {race?.bonus_question}
                                      </h1>
                                      <h1 className="text-2xl mt-2 text-yellow-400">
                                        {prediction.bonus}
                                      </h1>
                                    </>
                                  ) : null
                                }
                              />
                            </Section>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="animate-slideUp">
                    <PredictTopPicks type={'Kwalificatie'} picks={picksKwali} />
                    <PredictTopPicks
                      type={'Race'}
                      picks={picksRace}
                      bonusPick={
                        race?.bonus_question && (
                          <>
                            <h1 className="text-gray-50 font-f1regulartext-xl">
                              {race?.bonus_question}
                            </h1>
                            <br />
                            <input
                              type="number"
                              name="bonus pick"
                              id="bonus"
                              className="w-full max-w-md px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-red-500 rounded-xl shadow-md text-lg text-white placeholder-gray-400 outline-none transition-all duration-300 text-center"
                              placeholder="Vul je antwoord in"
                              value={BONUS_PICK}
                              onChange={handleSelectChangeBonus}
                            />
                          </>
                        )
                      }
                      onSubmit={handlePredictButtonClick}
                    />
                  </div>
                )
              ) : (
                <Section>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border-2 border-red-600 max-w-3xl mx-auto mt-8">
                    <h1 className="text-3xl font-f1bold text-center text-red-500">
                      ⚠️ Deze race is afgelast
                    </h1>
                  </div>
                </Section>
              )}
            </Section>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fadeIn) {
          animation: fadeIn 0.5s ease-out;
        }

        :global(.animate-slideUp) {
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
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

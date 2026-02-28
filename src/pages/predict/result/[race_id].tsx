import { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../../components/background/Background';
import { LoadingIndicator } from '../../../components/loading/LoadingIndicator';
import { PredictionInfo } from '../../../components/predict/PredictionInfo';
import { PredictTopPicks } from '../../../components/predict/PredictTopPicks';
import { Section } from '../../../layout/Section';
import { AppConfig } from '../../../utils/AppConfig';

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
  result?: {
    kwali: [number, number, number];
    race: [number, number, number];
    bonus: number;
    number: number;
  };
};

type IDriverProps = {
  name: string;
  racenumber: number;
};

interface PageProps {
  raceId: number;
}

const PredictResult: NextPage<PageProps> = (props) => {
  const router = useRouter();

  let currentName: string | null;

  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [currentRaceNumber, setCurrentRaceNumber] = useState<number>(0);

  const [race, setRace] = useState<IRaceProps | null>(null);
  const [drivers, setDrivers] = useState<IDriverProps[]>([]);

  useEffect(() => {
    const fetchRace = async () => {
      setCurrentRaceNumber(props.raceId);

      const resRaces = await fetch(`/api/races/${props.raceId}`);
      const racesData = await resRaces.json();

      const resPred = await fetch(`/api/prediction/${props.raceId}`);
      const permData = await resPred.json();

      const resResult = await fetch(`/api/result/${props.raceId}`);
      const resultData = await resResult.json();

      if (permData.length === 0) {
        setRace(null);
      } else {
        setRace({
          ...racesData[0],
          predictions: permData,
          result: resultData[0],
        });
      }
      setLoading(false);
    };
    fetchRace();
  }, []);

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

  const getNameByDriverNumer = (number: number) => {
    return drivers.find((driver) => driver.racenumber === number)?.name;
  };

  const checkPrediction = (prediction: number, result: number) => {
    return prediction === result;
  };

  const backToPredictions = () => {
    router.push(`/predict/${currentRaceNumber}`);
  };

  const isPreviousButtonDisabled = () => {
    return index === 0;
  };

  const isNextButtonDisabled = () => {
    return index >= (race?.predictions?.length as number) - 1;
  };

  const handleNextButtonClick = () => {
    setIndex(index + 1);
  };

  const handlePreviousButtonClick = () => {
    setIndex(index - 1);
  };

  const hasPrediction = race?.predictions?.some(
    (prediction) => prediction.user === currentName
  );

  return (
    <Background
      color="linear-gradient(to bottom, #15141D, #15151E)"
      className="min-h-screen"
    >
      <div className="overflow-y-auto h-full">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
              <LoadingIndicator />
              <p className="text-white text-lg font-f1bold animate-pulse">
                Loading predictions...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
            <Section yPadding="pt-10 pb-32">
              {race !== null && (
                <>
                  <PredictionInfo
                    back={
                      <button
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-f1bold text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        type="submit"
                        onClick={backToPredictions}
                      >
                        Terug naar eigen voorspellingen
                      </button>
                    }
                    race={race?.race}
                    flag={
                      <img
                        src={`${router.basePath}/assets/images/${race?.race}.png`}
                        alt="flag"
                        style={{ maxWidth: '70px', maxHeight: '70px' }}
                        className="rounded-lg shadow-lg"
                      />
                    }
                    user={race?.predictions?.[index]?.user}
                    leftButton={
                      !isPreviousButtonDisabled() ? (
                        <button
                          type="submit"
                          onClick={handlePreviousButtonClick}
                          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-f1bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          <div className={'hidden sm:inline'}>← Vorige</div>
                          <div className={'inline sm:hidden'}>←</div>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled
                          className="bg-gray-800 text-gray-500 font-f1bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                        >
                          <div className={'hidden sm:inline'}>← Vorige</div>
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
                          <div className={'hidden sm:inline'}>Volgende →</div>
                          <div className={'inline sm:hidden'}>→</div>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled
                          className="bg-gray-800 text-gray-500 font-f1bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                        >
                          <div className={'hidden sm:inline'}>Volgende →</div>
                          <div className={'inline sm:hidden'}>→</div>
                        </button>
                      )
                    }
                  />
                  <div className="animate-slideUp">
                    <Section key={race?.predictions?.[index]?.number}>
                      <PredictTopPicks
                        type={'Kwalificatie'}
                        picks={(race?.predictions?.[index]?.kwali || []).map(
                          (pick, i) => {
                            const isPredictionCorrect =
                              race?.result !== undefined &&
                              checkPrediction(
                                pick,
                                race?.result?.kwali[i] as number
                              );

                            return (
                              <span
                                key={i}
                                className={
                                  // eslint-disable-next-line no-nested-ternary
                                  !race?.result
                                    ? 'text-gray-50 text-xl font-f1bold'
                                    : isPredictionCorrect
                                    ? 'text-green-400 text-xl font-f1bold'
                                    : 'text-red-400 text-xl font-f1bold'
                                }
                              >
                                {getNameByDriverNumer(pick)}
                                {/* eslint-disable-next-line no-nested-ternary */}
                                {!race?.result
                                  ? ''
                                  : isPredictionCorrect
                                  ? ` (+${AppConfig.points_good_pick_kwali[i]} punten)`
                                  : ` (${getNameByDriverNumer(
                                      race?.result?.kwali[i] as number
                                    )})`}
                              </span>
                            );
                          }
                        )}
                      />
                      <PredictTopPicks
                        type={'Race'}
                        picks={(race?.predictions?.[index]?.race || []).map(
                          (pick, i) => {
                            const isPredictionCorrect =
                              race?.result !== undefined &&
                              checkPrediction(
                                pick,
                                race?.result?.race[i] as number
                              );

                            return (
                              <span
                                key={i}
                                className={
                                  // eslint-disable-next-line no-nested-ternary
                                  !race?.result
                                    ? 'text-gray-50 text-xl font-f1bold'
                                    : isPredictionCorrect
                                    ? 'text-green-400 text-xl font-f1bold'
                                    : 'text-red-400 text-xl font-f1bold'
                                }
                              >
                                {getNameByDriverNumer(pick)}
                                {/* eslint-disable-next-line no-nested-ternary */}
                                {!race?.result
                                  ? ''
                                  : isPredictionCorrect
                                  ? ` (+${AppConfig.points_good_pick_race[i]} punten)`
                                  : ` (${getNameByDriverNumer(
                                      race?.result?.race[i] as number
                                    )})`}
                              </span>
                            );
                          }
                        )}
                        bonusPick={
                          race?.bonus_question ? (
                            <>
                              <h1 className="font-f1bold text-xl text-gray-50 mb-4">
                                {race?.bonus_question}
                              </h1>
                              <h1 className="text-2xl mt-2">
                                {/* eslint-disable-next-line no-nested-ternary */}
                                {!race?.result ? (
                                  <span className="text-gray-50 font-f1bold">
                                    {race?.predictions?.[index]?.bonus}
                                  </span>
                                ) : checkPrediction(
                                    race?.predictions?.[index]?.bonus as number,
                                    race?.result?.bonus as number
                                  ) ? (
                                  <span className="text-green-400 font-f1bold">
                                    {race?.predictions?.[index]?.bonus} (+
                                    {AppConfig.points_good_pick_bonus} punten)
                                  </span>
                                ) : (
                                  <span className="text-red-400 font-f1bold">
                                    {race?.predictions?.[index]?.bonus}{' '}
                                    (Correct: {race?.result?.bonus})
                                  </span>
                                )}
                              </h1>
                            </>
                          ) : null
                        }
                      />
                    </Section>
                  </div>
                </>
              )}
              {race === null ||
                (!hasPrediction && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border-2 border-gray-700 max-w-3xl mx-auto mt-8">
                    <p className="text-white text-xl font-f1bold text-center">
                      Er is geen voorspelling gevonden.
                    </p>
                  </div>
                ))}
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

export default PredictResult;

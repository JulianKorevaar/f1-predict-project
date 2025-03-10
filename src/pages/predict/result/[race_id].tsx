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
            {race !== null && (
              <>
                <PredictionInfo
                  back={
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
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
                    />
                  }
                  user={race?.predictions?.[index]?.user}
                  leftButton={
                    !isPreviousButtonDisabled() ? (
                      <button
                        type="submit"
                        className={'text-gray-100'}
                        onClick={handlePreviousButtonClick}
                      >
                        Vorige Voorspelling
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={'text-gray-100'}
                        disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        Vorige Voorspelling
                      </button>
                    )
                  }
                  rightButton={
                    !isNextButtonDisabled() ? (
                      <button
                        type="submit"
                        className="text-gray-100"
                        onClick={handleNextButtonClick}
                      >
                        Volgende Voorspelling
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled
                        className={'text-gray-100'}
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        Volgende Voorspelling
                      </button>
                    )
                  }
                />
                <div className="text-gray-500 text-sm text-center">
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
                                  ? 'text-gray-50'
                                  : isPredictionCorrect
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }
                            >
                              {getNameByDriverNumer(pick)}
                              {/* eslint-disable-next-line no-nested-ternary */}
                              {!race?.result
                                ? ''
                                : isPredictionCorrect
                                ? ` (+${AppConfig.points_good_pick_kwali[i]})`
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
                                  ? 'text-gray-50'
                                  : isPredictionCorrect
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }
                            >
                              {getNameByDriverNumer(pick)}
                              {/* eslint-disable-next-line no-nested-ternary */}
                              {!race?.result
                                ? ''
                                : isPredictionCorrect
                                ? ` (+${AppConfig.points_good_pick_race[i]})`
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
                            <h1> {race?.bonus_question} </h1>
                            <h1>
                              {/* eslint-disable-next-line no-nested-ternary */}
                              {!race?.result ? (
                                <span className="text-gray-50">
                                  {race?.predictions?.[index]?.bonus}
                                </span>
                              ) : checkPrediction(
                                  race?.predictions?.[index]?.bonus as number,
                                  race?.result?.bonus as number
                                ) ? (
                                <span className="text-green-500">
                                  {race?.predictions?.[index]?.bonus} (+
                                  {AppConfig.points_good_pick_bonus})
                                </span>
                              ) : (
                                <span className="text-red-500">
                                  {race?.predictions?.[index]?.bonus} (
                                  {race?.result?.bonus})
                                </span>
                              )}
                            </h1>
                          </>
                        ) : null
                      }
                    ></PredictTopPicks>
                  </Section>
                </div>
              </>
            )}
            {race === null ||
              (!hasPrediction && (
                <div className="text-gray-500 text-sm text-center">
                  Er is geen voorspelling gevonden.
                </div>
              ))}
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

export default PredictResult;

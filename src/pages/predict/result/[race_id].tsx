import { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../../components/background/Background';
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
      race: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ];
      bonus: number;
      number: number;
    }
  ];
  result?: {
    kwali: [number, number, number];
    race: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ];
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

      if (permData.length === 0 || resultData.length === 0) {
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

  return (
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <div className="overflow-y-auto h-full">
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
          <Section yPadding="pt-10 pb-32">
            {race !== null && (
              <>
                <PredictionInfo
                  back={
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
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
                      <button type="submit" onClick={handlePreviousButtonClick}>
                        Vorige Voorspelling
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        Vorige Voorspelling
                      </button>
                    )
                  }
                  rightButton={
                    !isNextButtonDisabled() ? (
                      <button type="submit" onClick={handleNextButtonClick}>
                        Volgende Voorspelling
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled
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
                      type={'Race'}
                      firstPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[0] as number,
                          race?.result?.race[0] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[0] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[0]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[0] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[0] as number
                            )}
                            )
                          </span>
                        )
                      }
                      secondPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[1] as number,
                          race?.result?.race[1] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[1] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[1]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[1] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[1] as number
                            )}
                            )
                          </span>
                        )
                      }
                      thirdPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[2] as number,
                          race?.result?.race[2] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[2] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[2]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[2] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[2] as number
                            )}
                            )
                          </span>
                        )
                      }
                      fourthPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[3] as number,
                          race?.result?.race[3] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[3] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[3]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[3] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[3] as number
                            )}
                            )
                          </span>
                        )
                      }
                      fifthPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[4] as number,
                          race?.result?.race[4] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[4] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[4]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[4] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[4] as number
                            )}
                            )
                          </span>
                        )
                      }
                      sixthPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[5] as number,
                          race?.result?.race[5] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[5] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[5]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[5] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[5] as number
                            )}
                            )
                          </span>
                        )
                      }
                      seventhPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[6] as number,
                          race?.result?.race[6] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[6] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[6]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[6] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[6] as number
                            )}
                            )
                          </span>
                        )
                      }
                      eightPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[7] as number,
                          race?.result?.race[7] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[7] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[7]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[7] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[7] as number
                            )}
                            )
                          </span>
                        )
                      }
                      ninthPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[8] as number,
                          race?.result?.race[8] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[8] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[8]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[8] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[8] as number
                            )}
                            )
                          </span>
                        )
                      }
                      tenthPick={
                        checkPrediction(
                          race?.predictions?.[index]?.race[9] as number,
                          race?.result?.race[9] as number
                        ) ? (
                          <span className="text-green-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[9] as number
                            )}{' '}
                            (+
                            {AppConfig.points_good_pick_race[9]})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {getNameByDriverNumer(
                              race?.predictions?.[index]?.race[9] as number
                            )}{' '}
                            (
                            {getNameByDriverNumer(
                              race?.result?.race[9] as number
                            )}
                            )
                          </span>
                        )
                      }
                      bonusPick={
                        race?.bonus_question ? (
                          <>
                            <h1> {race?.bonus_question} </h1>
                            <h1>
                              {checkPrediction(
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
            {race === null && (
              <div className="text-gray-500 text-sm text-center">
                Er is geen voorspelling gevonden.
              </div>
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

export default PredictResult;

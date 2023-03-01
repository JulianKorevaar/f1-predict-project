import { ReactNode } from 'react';

type IPredictTopPicksProps = {
  type: string;
  firstPick: ReactNode;
  secondPick: ReactNode;
  thirdPick: ReactNode;
  bonusPick?: ReactNode;
  submit?: ReactNode;
};

const PredictTopPicks = (props: IPredictTopPicksProps) => (
  <header className="text-center">
    <h1 className="text-5xl text-gray-900 font-bold whitespace-pre-line leading-hero">
      {props.type}
    </h1>
    <br></br>1e Plaats
    <br></br>
    {props.firstPick}
    <br></br>
    <br></br>2e Plaats
    <br></br>
    {props.secondPick}
    <br></br>
    <br></br>3e Plaats
    <br></br>
    {props.thirdPick}
    <br></br>
    <br></br>
    {props.bonusPick && (
      <>
        <h1 className="text-5xl text-gray-900 font-bold whitespace-pre-line leading-hero">
          Bonusvraag
        </h1>
        <br></br>
        {props.bonusPick}
        <br></br>
        <br></br>
      </>
    )}
    {props.submit}
  </header>
);

export { PredictTopPicks };

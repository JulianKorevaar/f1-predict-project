import { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  input: ReactNode;
  button: ReactNode;
};

const HeroOneInput = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <h1 className="text-5xl text-gray-50 font-bold whitespace-pre-line leading-hero">
      {props.title}
    </h1>
    <br></br>
    {props.input}
    <br></br>
    <br></br>
    {props.button}
  </header>
);

export { HeroOneInput };

import { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description: string;
  button: ReactNode;
};

const HeroOneButton = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <h1 className="text-5xl text-gray-100 font-bold whitespace-pre-line leading-hero">
      {props.title}
    </h1>
    <div className="text-1xl text-gray-100 mt-8 mb-4">{props.description}</div>
    {props.button}
  </header>
);

export { HeroOneButton };

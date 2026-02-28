import { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description: string;
  button: ReactNode;
};

const HeroOneButton = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <div className={'flex flex-row items-center justify-center gap-4'}>
      <h1 className="text-5xl text-gray-100 font-f1regular font-bold whitespace-pre-line leading-hero">
        {props.title}
      </h1>
      <img
        src="/assets/images/f1_logo.png"
        alt="divider"
        className="w-40 h-10"
      />
    </div>
    <div className="text-md font-f1regular text-gray-500 mt-8 mb-2">
      {props.description}
    </div>
    {props.button}
  </header>
);

export { HeroOneButton };

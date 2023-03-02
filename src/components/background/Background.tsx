import { ReactNode } from 'react';

type IBackgroundProps = {
  children: ReactNode;
  color: string;
  className?: string;
};

const Background = (props: IBackgroundProps) => (
  <div className={`min-h-screen ${props.color} ${props.className}`}>
    {props.children}
  </div>
);

export { Background };

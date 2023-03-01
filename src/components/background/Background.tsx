import { ReactNode } from 'react';

type IBackgroundProps = {
  children: ReactNode;
  color: string;
  className?: string;
};

const Background = (props: IBackgroundProps) => (
  <div className={props.color}>{props.children}</div>
);

export { Background };

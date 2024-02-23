import React, { ReactNode } from 'react';

type IBackgroundProps = {
  children: ReactNode;
  color: string;
  className?: string;
  style?: React.CSSProperties;
};

const Background = (props: IBackgroundProps) => {
  const gradient = `linear-gradient(to bottom, rgba(0, 0, 0, 0), transparent 70%)`;

  const style = {
    minHeight: '100vh',
    background: `${gradient}, ${props.color}`,
    ...props.style,
  };

  return (
    <div className={props.className} style={style}>
      {props.children}
    </div>
  );
};

export { Background };

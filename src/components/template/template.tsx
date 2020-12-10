import React, {FC} from 'react';
import './template.css';

type Props = {
  text: string;
};

export const Template: FC<Props> = ({text}) => {
  return <div className="template">{text}</div>;
};


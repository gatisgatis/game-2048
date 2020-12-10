import React from 'react';
import './App.module.scss';
import { addNewNumberInGame, makeOneDimensionArray, moveNumbers } from './helpers/helpers';


export const App = () => {
  return (
    <div>
      <div className="container">
        <h1>2048 Game</h1>
      </div>
    </div>
  );
};

import React, { FC, useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './App.module.scss';
import {
  handlePressedKey,
  calculateResult,
  isGameOver,
  isGameWon,
  initGameGrid,
} from './helpers/helpers';

export const App: FC = () => {
  const [pressedKey, setPressedKey] = useState('');
  const [gameEnd, setGameEnd] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const grid = useRef(initGameGrid());
  const result = useRef(calculateResult(grid.current));

  useEffect(() => {
    document.body.addEventListener('keydown', (event) => {
      setPressedKey(event.key);
    });
    return () => {
      document.body.removeEventListener('keydown', (event) => {});
    };
  }, []);

  useEffect(() => {
    if (pressedKey) {
      grid.current = handlePressedKey(grid.current, pressedKey);
      result.current = calculateResult(grid.current);
      if (isGameOver(grid.current)) {
        setGameEnd(true);
      }
      if (isGameWon(grid.current)) {
        setGameWon(true);
      }
      setPressedKey('');
    }
  }, [pressedKey]);

  return (
    <div>
      <div className="container">
        <h1>2048 Game. Result: {result.current} </h1>
        {gameEnd && <h1>GAME OVER!!!</h1>}
        {gameWon && <h1>GAME WON!!!</h1>}
        <div className={styles.wrapper}>
          {grid.current.map((cell) => {
            return (
              <div
                key={uuid()}
                className={styles.cell}
                style={{
                  backgroundColor: `rgb(${200},${255 - cell * 2},${255 - cell * 0.5})`,
                }}
              >
                {cell !== 0 && cell}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

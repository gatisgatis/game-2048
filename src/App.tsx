import React, { FC, useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './App.module.scss';
import { useLocalStorage } from './helpers/useLocalStorage';
import {
  handlePressedKey,
  calculateResult,
  isGameOver,
  isGameWon,
  initGameGrid,
} from './helpers/helpers';
import { calculateColor, calculateFontSize } from './helpers/helpers-ui';

// KĀ LAI UZLIEKU,LAI NEKLAUSĀS KLAVIATŪRU TAD,
// KAD TIEK UZLIKTAS SCREEN BUTTONS UN TAD KAD IZLEC WON GAME LOGS

export const App: FC = () => {
  const [pressedKey, setPressedKey] = useState('');
  const [gameEnd, setGameEnd] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [controlButtons, setControlButtons] = useState(false);

  const [bestResult, setBestResult] = useLocalStorage('bestResult2048game', 0);

  const grid = useRef(initGameGrid());
  const result = useRef(calculateResult(grid.current));

  const keyboardFunction = (event: KeyboardEvent) => {
    setPressedKey(event.key);
  };

  const addKeyBoardListener = () => {
    document.body.addEventListener('keydown', keyboardFunction);
  };

  const removeKeyBoardListener = () => {
    document.body.removeEventListener('keydown', keyboardFunction);
  };

  useEffect(() => {
    addKeyBoardListener();
    if (window.innerWidth < 600) {
      setControlButtons(!controlButtons);
    }
    return () => {
      removeKeyBoardListener();
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
      if (result.current > bestResult) {
        setBestResult(result.current);
      }
      setPressedKey('');
    }
  }, [pressedKey]);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.titleBig}>2048 </span>
          <span className={styles.titleSmall}>THE GAME</span>
        </div>
        <button
          type="button"
          className={styles.restartButton}
          onClick={() => {
            grid.current = initGameGrid();
            setPressedKey('restart');
          }}
        >
          RESTART
        </button>
        <div className={styles.scores}>
          <div className={styles.best}>BEST: {bestResult}</div>
          <div className={styles.currentScore}>SCORE: {result.current}</div>
        </div>
      </div>
      {gameEnd && (
        <div className={styles.popupWrapper}>
          <button
            type="button"
            className={styles.popupCloseButton}
            onClick={() => setGameEnd(!gameEnd)}
          >
            CLOSE
          </button>
          <div className={styles.popup}>
            <span className={styles.popupTitle}>GAME OVER</span>
            <button
              type="button"
              className={styles.popupButton}
              onClick={() => {
                grid.current = initGameGrid();
                setPressedKey('restart');
                setGameEnd(!gameEnd);
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
      {gameWon && (
        <div className={styles.popupWrapper}>
          <button
            type="button"
            className={styles.popupCloseButton}
            onClick={() => setGameWon(!gameWon)}
          >
            CLOSE
          </button>
          <div className={styles.popup}>
            <span className={styles.popupTitle}>YOU WON</span>
            <button
              className={styles.popupButton}
              type="button"
              onClick={() => setGameWon(!gameWon)}
            >
              CONTINUE PLAYING
            </button>
          </div>
        </div>
      )}
      <div className={styles.gridWrapper}>
        {grid.current.map((cell) => {
          return (
            <div
              className={styles.cell}
              key={uuid()}
              style={{
                backgroundColor: calculateColor(cell),
                color: cell === 0 ? 'transparent' : ' rgb(60, 60, 60)',
                fontSize: calculateFontSize(cell),
              }}
            >
              <div className={styles.number}>{cell}</div>
            </div>
          );
        })}
      </div>
      {controlButtons && (
        <div className={styles.controlsWrapper}>
          <div className={styles.controlButtonWrapper}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setPressedKey('ArrowUp')}
            >
              UP
            </button>
          </div>
          <div className={styles.controlButtonWrapper}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setPressedKey('ArrowLeft')}
            >
              LEFT
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setPressedKey('ArrowRight')}
            >
              RIGHT
            </button>
          </div>
          <div className={styles.controlButtonWrapper}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setPressedKey('ArrowDown')}
            >
              DOWN
            </button>
          </div>
        </div>
      )}
      <div className={styles.rules}>
        HOW TO PLAY: Use your arrow keys (or controls on screen) to move the tiles. Tiles with the
        same number merge into one when they touch. Add them up to reach 2048!
        <button
          type="button"
          className={styles.showArrowsButton}
          onClick={() => {
            setControlButtons(!controlButtons);
          }}
        >
          {controlButtons ? 'HIDE CONTROLS' : 'SHOW CONTROLS'}
        </button>
      </div>
    </div>
  );
};

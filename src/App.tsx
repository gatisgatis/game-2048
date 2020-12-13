/* eslint-disable no-lonely-if */
import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
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

export const App: FC = () => {
  const [pressedKey, setPressedKey] = useState('');
  const [gameEnd, setGameEnd] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [controlButtons, setControlButtons] = useState(false);

  const [bestResult, setBestResult] = useLocalStorage('bestResult2048game', 0);

  const grid = useRef(initGameGrid());
  const result = useRef(calculateResult(grid.current));
  const hasWon = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const keyboardFunction = useCallback((event: KeyboardEvent) => {
    setPressedKey(event.key);
  }, []);

  const addKeyBoardListener = () => {
    document.body.addEventListener('keydown', keyboardFunction);
  };

  const removeKeyBoardListener = () => {
    document.body.removeEventListener('keydown', keyboardFunction);
  };

  useEffect(() => {
    addKeyBoardListener();
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
      if (isGameWon(grid.current) && !hasWon.current) {
        setGameWon(true);
        hasWon.current = true;
        removeKeyBoardListener();
      }
      if (result.current > bestResult) {
        setBestResult(result.current);
      }
      setPressedKey('');
    }
  }, [pressedKey]);

  const handleStartTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleEndTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    const x = event.changedTouches[0].clientX - touchStartX.current;
    const y = event.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(x) >= Math.abs(y)) {
      if (x > 0) {
        setPressedKey('ArrowRight');
      } else {
        setPressedKey('ArrowLeft');
      }
    } else {
      if (y > 0) {
        setPressedKey('ArrowDown');
      } else {
        setPressedKey('ArrowUp');
      }
    }
  };

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
            hasWon.current = false;
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
                hasWon.current = false;
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
            onClick={() => {
              setGameWon(!gameWon);
              addKeyBoardListener();
            }}
          >
            CLOSE
          </button>
          <div className={styles.popup}>
            <span className={styles.popupTitle}>YOU WON</span>
            <button
              className={styles.popupButton}
              type="button"
              onClick={() => {
                setGameWon(!gameWon);
                addKeyBoardListener();
              }}
            >
              CONTINUE PLAYING
            </button>
          </div>
        </div>
      )}
      <div
        className={styles.gridWrapper}
        onTouchStart={handleStartTouch}
        onTouchEnd={handleEndTouch}
      >
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
            controlButtons ? addKeyBoardListener() : removeKeyBoardListener();
          }}
        >
          {controlButtons ? 'HIDE CONTROLS' : 'SHOW CONTROLS'}
        </button>
      </div>
    </div>
  );
};

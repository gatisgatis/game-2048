/* eslint-disable no-param-reassign */
import _ from 'lodash';

type Direction = 'up' | 'down' | 'left' | 'right';

const PARSED_KEYS: { [key: string]: Direction } = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export const generate2or4randomly = () => {
  return _.random(10, true) > 9 ? 4 : 2;
};

export const makeOneDimensionArray = <T>(length: number, fill: T) => {
  const times = Math.floor(length);
  const output: T[] = [];
  for (let i = 0; i < times; i++) {
    output.push(fill);
  }
  return output;
};

export const addNewNumberInGame = (arr: number[]) => {
  const output = [...arr];

  // while version
  let stopLoop = false;
  while (!stopLoop) {
    const index = _.random(0, arr.length - 1);
    if (!output[index]) {
      output[index] = generate2or4randomly();
      stopLoop = true;
    }
  }
  // recursion version
  //   const index = _.random(0, arr.length-1);
  //   const output = [...arr];
  //   if (output[index] === 0) {
  //     output[index] = generate2or4randomly();
  //   } else {
  //     addNewNumberInGame(arr);
  //   }
  return output;
};

export const initGameGrid = () => {
  let output = makeOneDimensionArray(16, 0);
  output = addNewNumberInGame(output);
  return addNewNumberInGame(output);
};

export const splitArrayInRows = (arr: number[], direction: Direction) => {
  // array containing 4 game rows
  const rows: number[][] = [];
  // splits array in 4 rows
  if (direction === 'left' || direction === 'right')
    for (let i = 0; i < 4; i++) {
      rows.push(arr.slice(i * 4, i * 4 + 4));
    }
  // splits array in 4 columns making them as rows temporary
  if (direction === 'up' || direction === 'down') {
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        row.push(arr[i + j * 4]);
      }
      rows.push(row);
    }
  }
  return rows;
};

export const moveNumbers = (arr: number[], direction: Direction) => {
  const output: number[] = [];
  const rows = splitArrayInRows(arr, direction);
  rows.forEach((row, index) => {
    // filters out only non zero elements
    const rowNoZeros = row.filter((number) => number);
    // calculates zero count in that row
    const zerosCount = 4 - rowNoZeros.length;
    // makes corresponding zeros part of the row
    const rowZeros = makeOneDimensionArray(zerosCount, 0);
    // combines them according to given direction and push them in output array
    let newRow: number[] = [];
    if (direction === 'right') {
      newRow = [...rowZeros, ...rowNoZeros];
      output.push(...newRow);
    } else if (direction === 'left') {
      newRow = [...rowNoZeros, ...rowZeros];
      output.push(...newRow);
    } else if (direction === 'up') {
      newRow = [...rowNoZeros, ...rowZeros];
      for (let i = 0; i < 4; i++) {
        output[i * 4 + index] = newRow[i];
      }
    } else {
      newRow = [...rowZeros, ...rowNoZeros];
      for (let i = 0; i < 4; i++) {
        output[i * 4 + index] = newRow[i];
      }
    }
  });
  return output;
};

export const mergeOneRow = (oneRow: number[]) => {
  const row = [...oneRow];
  for (let i = 3; i > 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      if (row[i] && row[j]) {
        if (row[i] !== row[j]) {
          break;
        } else {
          row[i] *= 2;
          row[j] = 0;
          break;
        }
      }
    }
  }
  return row;
};

export const mergeNumbers = (arr: number[], direction: Direction) => {
  const output: number[] = [];
  const rows = splitArrayInRows(arr, direction);
  rows.forEach((row, index) => {
    switch (direction) {
      case 'right':
        output.push(...mergeOneRow(row));
        break;
      case 'left':
        row.reverse();
        output.push(...mergeOneRow(row).reverse());
        break;
      case 'up':
        row.reverse();
        row = mergeOneRow(row).reverse();
        for (let i = 0; i < 4; i++) {
          output[i * 4 + index] = row[i];
        }
        break;
      case 'down':
        row = mergeOneRow(row);
        for (let i = 0; i < 4; i++) {
          output[i * 4 + index] = row[i];
        }
        break;
    }
  });
  return output;
};

export const handlePressedKey = (arr: number[], key: string) => {
  if (!Object.keys(PARSED_KEYS).includes(key)) {
    return [...arr];
  }
  const direction = PARSED_KEYS[`${key}`];
  const prevGrid = [...arr];
  let newGrid = mergeNumbers(arr, direction);
  newGrid = moveNumbers(newGrid, direction);
  if (!_.isEqual(prevGrid, newGrid)) {
    newGrid = addNewNumberInGame(newGrid);
  }
  return newGrid;
};

export const calculateResult = (arr: number[]) => {
  return arr.reduce((res, num) => res + num, 0);
};

export const isGameOver = (arr: number[]) => {
  const isRightUnable = _.isEqual(arr, handlePressedKey(arr, 'ArrowRight'));
  const isLeftUnable = _.isEqual(arr, handlePressedKey(arr, 'ArrowLeft'));
  const isUpUnable = _.isEqual(arr, handlePressedKey(arr, 'ArrowUp'));
  const isDownUnable = _.isEqual(arr, handlePressedKey(arr, 'ArrowDown'));
  if (isUpUnable && isDownUnable && isLeftUnable && isRightUnable) {
    return true;
  }
  return false;
};

export const isGameWon = (arr: number[]) => {
  if (arr.includes(2048)) {
    return true;
  }
  return false;
};

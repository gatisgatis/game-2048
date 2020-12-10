/* eslint-disable no-param-reassign */
import _ from 'lodash';

type Direction = 'up' | 'down' | 'left' | 'right';

export const generate2or4randomly = () => {
  return _.random(2, true) > 1 ? 4 : 2;
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
    const index = _.random(0, arr.length);
    if (!output[index]) {
      output[index] = generate2or4randomly();
      stopLoop = true;
    }
  }
  // recursion version
  //   const index = _.random(0, arr.length);
  //   const output = [...arr];
  //   if (output[index] === 0) {
  //     output[index] = generate2or4randomly();
  //   } else {
  //     addNewNumberInGame(arr);
  //   }
  return output;
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
    } else if (direction === 'down') {
      newRow = [...rowZeros, ...rowNoZeros];
      for (let i = 0; i < 4; i++) {
        output[i * 4 + index] = newRow[i];
      }
    }
  });
  return output;
};

export const mergeNumbers = (arr: number[], direction: Direction) => {
  const output: number[] = [];
  const rows = splitArrayInRows(arr, direction);
  rows.forEach((row, index) => {
    switch (direction) {
      case 'right':
        for (let i = 3; i > 0; i--) {
          if (row[i] && row[i] === row[i - 1]) {
            row[i] *= 2;
            row[i - 1] = 0;
          }
        }
        output.push(...row);
        break;
      case 'left':
        for (let i = 0; i < 3; i++) {
          if (row[i] && row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
          }
        }
        output.push(...row);
        break;
      case 'up':
        for (let i = 0; i < 3; i++) {
          if (row[i] && row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
          }
        }
        for (let i = 0; i < 4; i++) {
          output[i * 4 + index] = row[i];
        }
        break;
      case 'down':
        for (let i = 3; i > 0; i--) {
          if (row[i] && row[i] === row[i - 1]) {
            row[i] *= 2;
            row[i - 1] = 0;
          }
        }
        for (let i = 0; i < 4; i++) {
          output[i * 4 + index] = row[i];
        }
        break;
    }
  });
  return output;
};

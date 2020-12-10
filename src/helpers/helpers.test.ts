import _ from 'lodash';
import {
  generate2or4randomly,
  makeOneDimensionArray,
  addNewNumberInGame,
  splitArrayInRows,
  moveNumbers,
  mergeNumbers,
} from './helpers';

describe('generate2or4randomly()', () => {
  it('should always generate 2 or 4', () => {
    const result = generate2or4randomly();
    const output = result === 2 || result === 4;
    expect(output).toBeTruthy();
  });
  it('should not generate number which are not either 2 or 4 test 1', () => {
    const result = generate2or4randomly();
    const output = result !== 2 && result !== 4;
    expect(output).toBeFalsy();
  });
  it('should not generate number which are not either 2 or 4 test 2', () => {
    const result = generate2or4randomly();
    expect(result).not.toBe(5);
  });
  it('should generate 2 about half the time and 4 about half the time', () => {
    const result: number[] = [];
    for (let i = 0; i < 1000; i++) {
      result.push(generate2or4randomly());
    }
    const arr2s = result.filter((num) => num === 2);
    const arr4s = result.filter((num) => num === 4);
    const diff = Math.abs(arr2s.length - arr4s.length);
    expect(diff).toBeLessThan(100);
  });
});

describe('makeOneDimensionArray', () => {
  it('should make array of numbers', () => {
    const result = makeOneDimensionArray(4, 0);
    expect(result).toEqual([0, 0, 0, 0]);
  });
  it('should make array of strings', () => {
    const result = makeOneDimensionArray(4, 'ABC');
    expect(result).toEqual(['ABC', 'ABC', 'ABC', 'ABC']);
  });
  it('should make empty array if size is negative', () => {
    const result = makeOneDimensionArray(-5, 'ABC');
    expect(result).toEqual([]);
  });
  it('should make array if size is decimal', () => {
    const result = makeOneDimensionArray(3.23, 1);
    expect(result).toEqual([1, 1, 1]);
  });
});

describe('addNewNumberInGame', () => {
  it('should work corectly', () => {
    const lodashSpy = jest.spyOn(_, 'random');
    lodashSpy.mockReturnValueOnce(1);
    const inputArr = makeOneDimensionArray(4, 0);
    expect(inputArr).toEqual([0, 0, 0, 0]);
    const result = addNewNumberInGame(inputArr);
    expect(result[1]).not.toBe(0);
    lodashSpy.mockReturnValueOnce(3);
    expect(inputArr).toEqual([0, 0, 0, 0]);
    const result2 = addNewNumberInGame(inputArr);
    expect(result2[3]).not.toBe(0);
    const result2left = result2.slice(0, 3);
    expect(result2left).toEqual([0, 0, 0]);
  });
});

describe('splitArrayInRows', () => {
  it('should split horizontaly', () => {
    const input = makeOneDimensionArray(16, 0);
    input[2] = 2;
    input[7] = 2;
    const expectedOutput = [
      [0, 0, 2, 0],
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = splitArrayInRows(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should split verticaly', () => {
    const input = makeOneDimensionArray(16, 0);
    input[2] = 2;
    input[7] = 2;
    const expectedOutput = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 2, 0, 0],
    ];
    const result = splitArrayInRows(input, 'up');
    expect(result).toEqual(expectedOutput);
  });
});

describe('moveRight', () => {
  const arr = makeOneDimensionArray(16, 0);
  const temp = [...arr];
  arr[0] = 2;
  arr[1] = 2;
  arr[6] = 2;
  arr[9] = 2;
  arr[15] = 2;
  it('should work correctly moving RIGHT', () => {
    const expectedOutput = [...temp];
    expectedOutput[3] = 2;
    expectedOutput[2] = 2;
    expectedOutput[7] = 2;
    expectedOutput[11] = 2;
    expectedOutput[15] = 2;
    const result = moveNumbers(arr, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should work correctly moving LEFT', () => {
    const expectedOutput = [...temp];
    expectedOutput[0] = 2;
    expectedOutput[1] = 2;
    expectedOutput[4] = 2;
    expectedOutput[8] = 2;
    expectedOutput[12] = 2;
    const result = moveNumbers(arr, 'left');
    expect(result).toEqual(expectedOutput);
  });
  it('should work correctly moving UP', () => {
    const expectedOutput = [...temp];
    expectedOutput[0] = 2;
    expectedOutput[1] = 2;
    expectedOutput[2] = 2;
    expectedOutput[3] = 2;
    expectedOutput[5] = 2;
    const result = moveNumbers(arr, 'up');
    expect(result).toEqual(expectedOutput);
  });
  it('should work correctly moving DOWN', () => {
    const expectedOutput = [...temp];
    expectedOutput[12] = 2;
    expectedOutput[9] = 2;
    expectedOutput[13] = 2;
    expectedOutput[14] = 2;
    expectedOutput[15] = 2;
    const result = moveNumbers(arr, 'down');
    expect(result).toEqual(expectedOutput);
  });
  it('should work correctly with full line', () => {
    arr[2] = 2;
    arr[3] = 2;
    const expectedOutput = [...temp];
    expectedOutput[0] = 2;
    expectedOutput[1] = 2;
    expectedOutput[3] = 2;
    expectedOutput[2] = 2;
    expectedOutput[7] = 2;
    expectedOutput[11] = 2;
    expectedOutput[15] = 2;
    const result = moveNumbers(arr, 'right');
    expect(result).toEqual(expectedOutput);
  });
});

describe('mergeNumbers', () => {
  it('should merge numbers RIGHT direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 2;
    input[1] = 2;
    expectedOutput[1] = 4;
    const result = mergeNumbers(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge numbers LEFT direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 2;
    input[1] = 2;
    expectedOutput[0] = 4;
    const result = mergeNumbers(input, 'left');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge numbers UP direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[1] = 2;
    input[5] = 2;
    expectedOutput[1] = 4;
    const result = mergeNumbers(input, 'up');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge numbers DOWN direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[1] = 2;
    input[5] = 2;
    expectedOutput[5] = 4;
    const result = mergeNumbers(input, 'down');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge only 2 numbers if there are 3 the same in the one line', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[1] = 2;
    input[5] = 2;
    input[9] = 2;
    expectedOutput[9] = 4;
    expectedOutput[1] = 2;
    const result = mergeNumbers(input, 'down');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge two pairs if there are 4 the same in the one line', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[1] = 2;
    input[5] = 2;
    input[9] = 2;
    input[13] = 2;
    expectedOutput[5] = 4;
    expectedOutput[13] = 4;
    const result = mergeNumbers(input, 'down');
    expect(result).toEqual(expectedOutput);
  });
});

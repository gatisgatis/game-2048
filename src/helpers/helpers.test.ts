import _ from 'lodash';
import {
  generate2or4randomly,
  makeOneDimensionArray,
  addNewNumberInGame,
  splitArrayInRows,
  moveNumbers,
  mergeNumbers,
  handlePressedKey,
  calculateResult,
  isGameOver,
  isGameWon,
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
  it('should generate 2s about 90% of time', () => {
    const result: number[] = [];
    for (let i = 0; i < 1000; i++) {
      result.push(generate2or4randomly());
    }
    const arr2s = result.filter((num) => num === 2);
    const arr4s = result.filter((num) => num === 4);
    const diff = Math.abs(arr2s.length - arr4s.length);
    expect(diff).toBeGreaterThan(750);
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
    const lodashRandomSpy = jest.spyOn(_, 'random');
    lodashRandomSpy.mockReturnValueOnce(1);
    const inputArr = makeOneDimensionArray(4, 0);
    expect(inputArr).toEqual([0, 0, 0, 0]);
    const result = addNewNumberInGame(inputArr);
    expect(result[1]).not.toBe(0);
    lodashRandomSpy.mockReturnValueOnce(3);
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

describe('moveNumbers', () => {
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
  it('should merge numbers which are not adjacent right direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 2;
    input[3] = 2;
    expectedOutput[3] = 4;
    const result = mergeNumbers(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge numbers which are not adjacent up direction', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[1] = 2;
    input[9] = 2;
    input[13] = 2;
    expectedOutput[13] = 2;
    expectedOutput[1] = 4;
    const result = mergeNumbers(input, 'up');
    expect(result).toEqual(expectedOutput);
  });
  it('should not merge same numbers if there are different number between them', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 2;
    input[1] = 4;
    input[2] = 2;
    expectedOutput[0] = 2;
    expectedOutput[1] = 4;
    expectedOutput[2] = 2;
    const result = mergeNumbers(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should not double merge', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 4;
    input[1] = 2;
    input[2] = 2;
    expectedOutput[0] = 4;
    expectedOutput[1] = 0;
    expectedOutput[2] = 4;
    const result = mergeNumbers(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should not double merge test2', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = [...input];
    input[0] = 2;
    input[1] = 4;
    input[2] = 4;
    input[3] = 4;
    expectedOutput[0] = 2;
    expectedOutput[1] = 4;
    expectedOutput[2] = 0;
    expectedOutput[3] = 8;
    const result = mergeNumbers(input, 'right');
    expect(result).toEqual(expectedOutput);
  });
  it('should not double merge Up direction', () => {
    const input = [2, 2, 2, 4, 2, 4, 2, 0, 4, 2, 2, 4, 0, 2, 2, 4];
    const expectedOutput = [4, 2, 4, 8, 0, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 4];
    const result = mergeNumbers(input, 'up');
    expect(result).toEqual(expectedOutput);
  });
  it('should merge complicated scenario LEFT direction', () => {
    const input = [2, 2, 2, 2, 2, 2, 0, 4, 4, 4, 8, 16, 2, 2, 4, 4];
    const expectedOutput = [4, 0, 4, 0, 4, 0, 0, 4, 8, 0, 8, 16, 4, 0, 8, 0];
    const result = mergeNumbers(input, 'left');
    expect(result).toEqual(expectedOutput);
  });
});

describe('handlePressedKey', () => {
  it('should work when pressed one arrows', () => {
    const lodashRandomSpy = jest.spyOn(_, 'random');
    lodashRandomSpy.mockReturnValue(4);
    const pressedKey = 'ArrowRight';
    const input = [8, 0, 2, 2, 0, 2, 4, 4, 2, 0, 4, 0, 4, 16, 0, 2];
    const expectedOutput = [0, 0, 8, 4, 0, 0, 2, 8, 2, 0, 2, 4, 0, 4, 16, 2];
    const result = handlePressedKey(input, pressedKey);
    expect(result).toEqual(expectedOutput);
  });
  it('should should do nothing when any other key than arrow pressed', () => {
    const pressedKey = 'd';
    const input = [8, 0, 2, 2, 0, 2, 4, 4, 2, 0, 4, 0, 4, 16, 0, 2];
    const expectedOutput = [8, 0, 2, 2, 0, 2, 4, 4, 2, 0, 4, 0, 4, 16, 0, 2];
    const result = handlePressedKey(input, pressedKey);
    expect(result).toEqual(expectedOutput);
  });
});

describe('calculateResult', () => {
  it('should work', () => {
    const input = [0, 4, 2, 8, 2, 4, 8, 0, 0, 2, 4, 16, 32];
    const expectedOutput = 82;
    const result = calculateResult(input);
    expect(result).toBe(expectedOutput);
  });
});

describe('isGameOver', () => {
  it('should return true if no move possible', () => {
    const input = [2, 4, 8, 2, 4, 2, 4, 8, 2, 4, 2, 4, 4, 2, 4, 2];
    const expectedOutput = true;
    const result = isGameOver(input);
    expect(result).toBe(expectedOutput);
  });
  it('should return false if full grid but merge possible', () => {
    const input = [2, 4, 8, 16, 16, 8, 4, 2, 2, 4, 8, 16, 16, 8, 2, 2];
    const expectedOutput = false;
    const result = isGameOver(input);
    expect(result).toBe(expectedOutput);
  });
  it('should return false if grid has only one cell filled', () => {
    const input = makeOneDimensionArray(16, 0);
    input[2] = 2;
    const expectedOutput = false;
    const result = isGameOver(input);
    expect(result).toBe(expectedOutput);
  });
  it('should return false if grid has at least one zero on it', () => {
    const input = [2, 4, 8, 2, 4, 2, 4, 8, 2, 0, 2, 4, 4, 2, 4, 2];
    const expectedOutput = false;
    const result = isGameOver(input);
    expect(result).toBe(expectedOutput);
  });
});

describe('isGameWon', () => {
  it('should return true if grid has at least one cell containing 2048', () => {
    const input = makeOneDimensionArray(16, 0);
    input[3] = 2048;
    const expectedOutput = true;
    const result = isGameWon(input);
    expect(result).toBe(expectedOutput);
  });
  it('should return false if grid has no cell containing 2048', () => {
    const input = makeOneDimensionArray(16, 0);
    const expectedOutput = false;
    const result = isGameWon(input);
    expect(result).toBe(expectedOutput);
  });
});

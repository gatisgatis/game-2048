export const calculateFontSize = (number: number) => {
  let size = '5rem';
  if (number > 99999) size = '1.5rem';
  else if (number > 9999) size = '2rem';
  else if (number > 999) size = '2.5rem';
  else if (number > 99) size = '3rem';
  else if (number > 9) size = '4rem';
  return size;
};

export const calculateColor = (number: number) => {
  const red = 255 - number * 0.5;
  const green = 200 + number * 0.5;
  const blue = 200 + number * 0.2;
  return `rgb(${red}, ${green}, ${blue})`;
};

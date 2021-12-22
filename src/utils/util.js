export const getRandomElementInArray = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomFloat = (start, end, precision) => (Math.random() * (end - start) + start).toFixed(precision);

export const getRandomIntInclusive = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const deleteItemInArray = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  items.splice(index, 1);

};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }
  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

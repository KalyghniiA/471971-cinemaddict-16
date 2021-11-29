import dayjs from 'dayjs';
import {getRandomIntInclusive} from './util';

export const creationDate = (min, max, type = 'day') => dayjs().add(getRandomIntInclusive(min, max), type).format();

export const generateFormatDate = (date, format) => dayjs(date).format(format);

export const generateDaysAgo = (date) => dayjs().diff(date, 'day');

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;

  if (hours === 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }

};

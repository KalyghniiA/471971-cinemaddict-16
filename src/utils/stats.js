import {NavigationActionType, SortStatsType} from '../const';
import {filter} from './filter';
import dayjs from 'dayjs';

const getValuesItems = (items) => {
  const valuesItems = [];

  for (const item of items.values()) {
    valuesItems.push(item);
  }

  return valuesItems;
};

const getKeysItems = (items) => {
  const keysItems = [];

  for (const item of items.keys()) {
    keysItems.push(item);
  }

  return keysItems;
};

const getUniqItemsAndCount = (items) => {
  const mapItems = new Map();

  items.forEach((item) => {
    if (mapItems.has(item)) {
      mapItems.set(item, mapItems.get(item) + 1);
    } else {
      mapItems.set(item, 1);
    }
  });

  return {genres: getKeysItems(mapItems), counts: getValuesItems(mapItems)};
};

const getFilteredHistoryFilms = (films) => filter[NavigationActionType.HISTORY](films);

export const getCountHistoryFilms = (films) => getFilteredHistoryFilms(films).length;

export const  getAmountOfWatchedMinutes = (films) => {
  const filteredHistoryFilms = getFilteredHistoryFilms(films);

  return filteredHistoryFilms.reduce((sum, item) => sum + item.filmInfo.runtime, 0);
};

export const getGenreHistoryFilms = (films) => {
  const filteredHistoryFilms = getFilteredHistoryFilms(films);
  const genresHistoryFilms =  filteredHistoryFilms.map((film) => film.filmInfo.genre);

  if (genresHistoryFilms.length === 0) {
    return {genres: [], counts: []};
  }

  const genresList = genresHistoryFilms.map((genres) => genres.join()).join().split(',');

  return getUniqItemsAndCount(genresList);
};

export const filterDataStatistics = {
  [SortStatsType.ALL_TIME]: (films) => films.sort(),
  [SortStatsType.MONTH]: (films) => films.filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'month') === 0),
  [SortStatsType.TODAY]: (films) =>  films.filter((film) => film.userDetails.watchingDate === dayjs()),
  [SortStatsType.WEEK]: (films) =>  films.filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'week') === 0),
  [SortStatsType.YEAR]: (films) =>  films.filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'year') === 0),
};

/*export const getUserRank = (value) => {
  for (const {name, min, max} of userRanks) {
    if (value >= min && value <= max) {
      return name;
    }
  }
};*/

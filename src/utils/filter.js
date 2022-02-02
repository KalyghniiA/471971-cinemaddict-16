import {NavigationActionType, SortStatsType} from '../const';
import dayjs from 'dayjs';
/*const filmsFilterMap = {
  watchlist: data.filter((film) => film.userDetails.watchlist),
  history: data.filter((film) => film.userDetails.alreadyWatched),
  favorite: data.filter((film) => film.userDetails.favorite),
};*/
export const filter = {
  [NavigationActionType.ALL_MOVIES]: (films) => films.filter((film) => film),
  [NavigationActionType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [NavigationActionType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [NavigationActionType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [NavigationActionType.STATS]: (films) => films.filter((film) => film),
};

export const filterStats = {
  [SortStatsType.ALL_TIME]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [SortStatsType.TODAY]: (films) => films.filter((film) => film.userDetails.alreadyWatched).filter((film) => film.userDetails.watchingDate === dayjs()),
  [SortStatsType.WEEK]: (films) => films.filter((film) => film.userDetails.alreadyWatched).filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'week') === 0),
  [SortStatsType.MONTH]: (films) => films.filter((film) => film.userDetails.alreadyWatched).filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'month') === 0),
  [SortStatsType.YEAR]: (films) => films.filter((film) => film.userDetails.alreadyWatched).filter((film) => dayjs().diff(dayjs(film.userDetails.watchingDate), 'year') === 0),
};


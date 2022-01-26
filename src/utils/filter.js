import {NavigationActionType} from '../const';
/*const filmsFilterMap = {
  watchlist: data.filter((film) => film.userDetails.watchlist),
  history: data.filter((film) => film.userDetails.alreadyWatched),
  favorite: data.filter((film) => film.userDetails.favorite),
};*/
export const filter = {
  [NavigationActionType.ALL_MOVIES]: (films) => films,
  [NavigationActionType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [NavigationActionType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [NavigationActionType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

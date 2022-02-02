export const Position = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const FilmsQuantity = {
  MAIN: 5,
  TOP_RATED: 2,
  MOST_COMMENTED: 2,
};

export const FilmsContainer = {
  MAIN_FILMS: 'main-films',
  TOP_RATED: 'top-rated',
  MOST_COMMENTED: 'most-commented',
};

export const FormateDate = {
  YEAR: 'YYYY',
  FULL: 'D MMMM YYYY',
  COMMENTS_DATE: 'YYYY/MM/D H:m',
};

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM_DETAILS : 'UPDATE_FILM_DETAILS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PRE_PATCH: 'PRE_PATCH',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const NavigationActionType = {
  ALL_MOVIES: 'ALL_MOVIES',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
  STATS: 'STATS',
};

export const SortStatsType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const UserRanks = [
  {
    name: 'Novice',
    min: 1,
    max: 10,
  },
  {
    name: 'Fun',
    min: 11,
    max: 20,
  },
  {
    name: 'Movie Buff',
    min: 21,
    max: Infinity,
  },
];

export const NoEmptyListText = {
  [NavigationActionType.ALL_MOVIES]:'There are no movies in our database',
  [NavigationActionType.FAVORITES]:'There are no favorite movies now',
  [NavigationActionType.HISTORY]:'There are no watched movies now',
  [NavigationActionType.WATCHLIST]:'There are no movies to watch now',
  [NavigationActionType.STATS]:'',
};

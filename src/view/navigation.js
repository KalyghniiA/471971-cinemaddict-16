import AbstractComponentView from './abstract-component';

const createNavigationElement = (data) => {

  const filmsFilterMap = {
    watchlist: data.filter((film) => film.userDetails.watchlist),
    history: data.filter((film) => film.userDetails.alreadyWatched),
    favorite: data.filter((film) => film.userDetails.favorite),
  };


  return (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filmsFilterMap.watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filmsFilterMap.history.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filmsFilterMap.favorite.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`);
};

export default class NavigationView extends AbstractComponentView{
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template () {
    return createNavigationElement(this.#data);
  }
}

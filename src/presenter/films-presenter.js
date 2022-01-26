import SortView from '../view/sort';
import FilmsView from '../view/films';
import ListEmptyView from '../view/list-empty';
import MainFilmsListView from '../view/main-films-list';
import TopRatedFilmsView from '../view/top-rated-films-list';
import MostCommentedFilmsListView from '../view/most-commented-films-list';
import {remove, render} from '../utils/render';
import {
  FilmsContainer,
  FilmsQuantity,
  NavigationActionType, Position,
  SortType,
  UpdateType,
  UserAction
} from '../const';
import FilmsListContainerView from '../view/films-list-container';
import StatisticsView from '../view/statistics';
import ButtonShowMoreView from '../view/show-more-button';
import FilmPresenter from './film-presenter';
import dayjs from 'dayjs';
import {filter} from '../utils/filter';
import NavigationView from '../view/navigation';


const FILM_CARD_COUNT_PER_STEP = 5;


export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;


  #filmsContainerComponent = new FilmsView();
  #listNoEmptyComponent = null;
  #mainFilmsListComponent = null;
  #topRatedFilmsListComponent = null;
  #mostCommentedFilmsListComponent = null;
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #sortComponent = null;
  #navigationComponent = null;

  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #mainFilmsMap = new Map();
  #topRatedFilmsMap = new Map();
  #mostCommentedFilmsMap = new Map();
  #sortingType = SortType.DEFAULT;

  constructor (container, filmsModel) {
    this.#mainContainer = container;
    this.#filmsModel = filmsModel;


    this.#filmsModel.addObserver(this.#handleModelEvent);

  }

  get filters () {
    const films = this.#filmsModel.films;

    return [
      {
        type: NavigationActionType.WATCHLIST,
        name: 'Watchlist',
        count: filter[NavigationActionType.WATCHLIST](films).length
      },
      {
        type: NavigationActionType.HISTORY,
        name: 'History',
        count: filter[NavigationActionType.HISTORY](films).length
      },
      {
        type: NavigationActionType.FAVORITES,
        name: 'Favorites',
        count: filter[NavigationActionType.FAVORITES](films).length
      },
    ];
  }

  get films () {
    const navigationType = this.#filmsModel.navigation;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[navigationType](films);

    switch (this.#sortingType) {
      case SortType.BY_DATE:
        return filteredFilms.sort((prev, next) => dayjs(prev.filmInfo.release.date).diff(next.filmInfo.release.date));
      case SortType.BY_RATING:
        return filteredFilms.sort((prev, next) => next.filmInfo.totalRating - prev.filmInfo.totalRating);
    }

    return filteredFilms;
  }

  get comments () {
    return this.#filmsModel.comments;
  }

  init = () => {
    this.#renderBoard();
    this.#renderStatistics();
  }

  #renderNavigation = () => {

    this.#navigationComponent = new NavigationView(this.filters, this.#filmsModel.navigation);
    this.#navigationComponent.setNavigationClick(this.#handleNavigationTypeClick);
    render(this.#mainContainer, this.#navigationComponent, Position.AFTERBEGIN);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#sortingType);
    render(this.#mainContainer, this.#sortComponent);
    this.#sortComponent.setSortClick(this.#handleSortChange);
  }

  #renderFilmCard = (filmData, container, filmsMap, filmsModel) => {
    const filmPresenter = new FilmPresenter(this.#handleViewAction,  container);
    filmPresenter.init(filmData, this.comments, filmsModel);
    filmsMap.set(filmData.id, filmPresenter);
  }

  #renderMainFilms = (container, films) => {
    this.#mainFilmsListComponent = new MainFilmsListView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MAIN_FILMS);
    render(container, this.#mainFilmsListComponent);
    render(this.#mainFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(films[i],filmsListContainer, this.#mainFilmsMap, this.#filmsModel);
    }


    if (films.length > FILM_CARD_COUNT_PER_STEP) {
      this.#renderButtonShowMore(filmsListContainer);
    }
  }

  #renderButtonShowMore = (container) => {


    render(this.#mainFilmsListComponent, this.#buttonShowMoreComponent);

    this.#buttonShowMoreComponent.setClickHandler(() => {

      this.films
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(film, container, this.#mainFilmsMap, this.#filmsModel));

      this.#renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.films.length) {
        remove(this.#buttonShowMoreComponent);
      }
    });
  }

  #renderTopRatedFilms = (container, data) => {
    this.#topRatedFilmsListComponent = new TopRatedFilmsView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.TOP_RATED);
    const films = [...data].sort((prev, next) => next.filmInfo.totalRating - prev.filmInfo.totalRating);
    render(container, this.#topRatedFilmsListComponent);
    render(this.#topRatedFilmsListComponent, filmsListContainer);
    for (let i = 0; i < Math.min(films.length, FilmsQuantity.TOP_RATED); i++) {
      this.#renderFilmCard(films[i], filmsListContainer, this.#topRatedFilmsMap, this.#filmsModel);
    }
  }

  #renderMostCommentedFilms = (container, data) => {
    this.#mostCommentedFilmsListComponent = new MostCommentedFilmsListView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MOST_COMMENTED);
    const films = [...data].sort((prev, next) => next.filmInfo.totalRating - prev.filmInfo.totalRating);
    render(container, this.#mostCommentedFilmsListComponent);
    render(this.#mostCommentedFilmsListComponent, filmsListContainer);
    films.sort((prev, next) => next.comments.length - prev.comments.length);
    for (let i = 0; i < Math.min(films.length, FilmsQuantity.MOST_COMMENTED); i++) {
      this.#renderFilmCard(films[i], filmsListContainer, this.#mostCommentedFilmsMap, this.#filmsModel);
    }
  }

  #renderListNoEmpty = () => {
    this.#listNoEmptyComponent = new ListEmptyView();
    render(this.#filmsContainerComponent, this.#listNoEmptyComponent);
  }

  #renderFilms = () => {
    if (!this.films.length) {
      render(this.#mainContainer, this.#filmsContainerComponent);
      this.#renderListNoEmpty();
    } else {
      render(this.#mainContainer, this.#filmsContainerComponent);
      this.#renderFilmsList(this.films);
    }
  }

  #renderFilmsList = (films) => {
    this.#renderMainFilms(this.#filmsContainerComponent, films);

    if (this.#sortingType === SortType.DEFAULT) {
      this.#renderTopRatedFilms(this.#filmsContainerComponent, films);
      this.#renderMostCommentedFilms(this.#filmsContainerComponent, films);
    }
  }

  #renderBoard = () => {
    this.#renderNavigation();
    this.#renderSort();
    this.#renderFilms();
  }

  #renderStatistics = () => {
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    render(footerStatisticsElement, new StatisticsView(this.films));
  }

  #clearFilms = () => {
    this.#mainFilmsMap.forEach((filmPresenter) => {
      filmPresenter.destroy();
    });
    this.#topRatedFilmsMap.forEach((filmPresenter) => {
      filmPresenter.destroy();
    });
    this.#mostCommentedFilmsMap.forEach((filmPresenter) => {
      filmPresenter.destroy();
    });
    this.#mainFilmsMap.clear();
    this.#topRatedFilmsMap.clear();
    this.#mostCommentedFilmsMap.clear();
    remove(this.#mainFilmsListComponent);
    remove(this.#topRatedFilmsListComponent);
    remove(this.#mostCommentedFilmsListComponent);
    this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }

  #clearBoard = () => {
    this.#clearNavigation();
    remove(this.#sortComponent);
    if (this.#listNoEmptyComponent) {
      remove(this.#listNoEmptyComponent);
    }
    this.#clearFilms();
  }

  #clearNavigation = () => {
    remove(this.#navigationComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM_DETAILS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#mainFilmsMap.has(data.id)) {
          this.#mainFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        if (this.#topRatedFilmsMap.has(data.id)){
          this.#topRatedFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        if (this.#mostCommentedFilmsMap.has(data.id)) {
          this.#mostCommentedFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        this.#clearNavigation();
        this.#renderNavigation();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
    }
  }


  #handleSortChange = (evt) => {
    const elem = evt.target;

    if (elem.dataset.sortType === this.#sortingType) {
      return;
    }

    this.#sortingType = elem.dataset.sortType;
    this.#toggleSortButton(elem);
    this.#clearFilms();
    this.#renderFilms();

  }

  #toggleSortButton = (elem) => {
    this.#sortComponent
      .element
      .querySelectorAll('.sort__button')
      .forEach((btn) => {
        btn.classList.remove('sort__button--active');
      });
    elem.classList.add('sort__button--active');
  }

  #handleNavigationTypeClick = (navigationType) => {
    if (this.#filmsModel.navigation === navigationType) {
      return;
    }

    this.#filmsModel.setNavigation(UpdateType.MINOR, navigationType);
  }

}

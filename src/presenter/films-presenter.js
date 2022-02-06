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
  NavigationActionType, NoEmptyListText, Position,
  SortType,
  UpdateType,
  UserAction
} from '../const';
import FilmsListContainerView from '../view/films-list-container';
import ButtonShowMoreView from '../view/show-more-button';
import FilmPresenter from './film-presenter';
import dayjs from 'dayjs';
import {filter} from '../utils/filter';
import NavigationView from '../view/navigation';
import FooterView from '../view/footer';
import StatisticsView from '../view/stats';
import PopupPresenter from './popup-presenter';
import ProfileView from '../view/profile';
import LoadingView from '../view/loading';


const FILM_CARD_COUNT_PER_STEP = 5;


export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;


  #filmsContainerComponent = new FilmsView();
  #listNoEmptyComponent = null;
  #mainFilmsListComponent = null;
  #topRatedFilmsListComponent = null;
  #mostCommentedFilmsListComponent = null;
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #sortComponent = null;
  #navigationComponent = null;
  #statsComponent = null;
  #popupComponent = null;
  #headerComponent = null;
  #loadingComponent = null;
  #footerComponent = null;

  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #mainFilmsMap = new Map();
  #topRatedFilmsMap = new Map();
  #mostCommentedFilmsMap = new Map();

  #sortingType = SortType.DEFAULT;
  #isLoading = true;


  constructor (container, filmsModel, commentsModel) {
    this.#mainContainer = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
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
        return filteredFilms.sort((prev, next) => dayjs(next.filmInfo.release.date).diff(prev.filmInfo.release.date));
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
    this.#renderFooter();
  }

  #renderHeader = () => {
    const headerContainerElement = document.querySelector('.header');
    const profileValue = filter[NavigationActionType.HISTORY](this.#filmsModel.films).length;
    this.#headerComponent = new ProfileView(profileValue);
    render(headerContainerElement, this.#headerComponent);
  }

  #renderNavigation = () => {

    this.#navigationComponent = new NavigationView(this.filters, this.#filmsModel.navigation);
    this.#navigationComponent.setNavigationClick(this.#handleNavigationTypeClick);
    this.#navigationComponent.setStatsClick(this.#handleStatsClick);
    render(this.#mainContainer, this.#navigationComponent, Position.AFTERBEGIN);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#sortingType);
    render(this.#mainContainer, this.#sortComponent);
    this.#sortComponent.setSortClick(this.#handleSortChange);
  }

  #renderLoading = () => {
    this.#loadingComponent = new LoadingView();
    render(this.#mainContainer, this.#loadingComponent);
  }

  #renderFilmCard = (filmData, container, filmsMap, filmsModel) => {
    const filmPresenter = new FilmPresenter(this.#handleViewAction,  container, this.#handlePopupOpen);
    filmPresenter.init(filmData, filmsModel);
    filmsMap.set(filmData.id, filmPresenter);
  }

  #renderFilmsCard = (films, container) => {
    films.forEach((film) => {
      this.#renderFilmCard(film,container, this.#mainFilmsMap, this.#filmsModel);
    });
  }

  #renderMainFilms = (container, films) => {
    this.#mainFilmsListComponent = new MainFilmsListView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MAIN_FILMS);
    render(container, this.#mainFilmsListComponent);
    render(this.#mainFilmsListComponent, filmsListContainer);

    this.#renderFilmsCard(films.slice(0, Math.min(films.length, this.#renderedFilmsCount)), filmsListContainer);


    if (films.length > this.#renderedFilmsCount) {
      this.#renderButtonShowMore(filmsListContainer);
    }
  }

  #renderButtonShowMore = (container) => {
    render(this.#mainFilmsListComponent, this.#buttonShowMoreComponent);
    this.#buttonShowMoreComponent.setClickHandler(() => {

      const filmCount = this.films.length;
      const newRenderedFilmsCount = Math.min(filmCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP);
      const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);
      this.#renderFilmsCard(films, container);
      this.#renderedFilmsCount = newRenderedFilmsCount;
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
    render(this.#mainContainer, this.#filmsContainerComponent);
    this.#listNoEmptyComponent = new ListEmptyView(NoEmptyListText[this.#filmsModel.navigation]);
    render(this.#filmsContainerComponent, this.#listNoEmptyComponent);
  }

  #renderFilms = () => {
    render(this.#mainContainer, this.#filmsContainerComponent);
    this.#renderFilmsList(this.films);
  }

  #renderFilmsList = (films) => {
    this.#renderMainFilms(this.#filmsContainerComponent, films);

    if (this.#sortingType === SortType.DEFAULT) {
      this.#renderTopRatedFilms(this.#filmsContainerComponent, films);
      this.#renderMostCommentedFilms(this.#filmsContainerComponent, films);
    }
  }

  #renderBoard = () => {
    this.#renderHeader();
    this.#renderNavigation();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (!this.films.length) {
      this.#renderListNoEmpty();
    } else {
      this.#renderSort();
      this.#renderFilms();
    }
  }

  #renderStats = () => {
    this.#renderHeader();
    this.#renderNavigation();
    this.#statsComponent = new StatisticsView(this.films);
    this.#statsComponent.restoreHandlers();
    render(this.#mainContainer, this.#statsComponent);
  }

  #renderFooter = () => {
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    this.#footerComponent = new FooterView(this.films);
    render(footerStatisticsElement,this.#footerComponent);
  }

  #clearFilms = (resetRenderedFilmCount = false) => {
    const filmsCount = this.films.length;

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

    if (!resetRenderedFilmCount) {
      this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }
    remove(this.#buttonShowMoreComponent);
  }

  #clearBoard = (value = false) => {
    this.#clearHeader();
    this.#clearNavigation();
    remove(this.#sortComponent);
    if (this.#listNoEmptyComponent) {
      remove(this.#listNoEmptyComponent);
    }

    if (this.#statsComponent) {
      this.#clearStats();
      this.#statsComponent = null;
    }

    this.#clearFilms(value);
  }

  #clearHeader = () => {
    remove(this.#headerComponent);
  }

  #clearNavigation = () => {
    remove(this.#navigationComponent);
  }

  #clearStats = () => {
    remove(this.#statsComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM_DETAILS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(update);
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PRE_PATCH:
        if (this.#mainFilmsMap.has(data.id)) {
          this.#mainFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        if (this.#topRatedFilmsMap.has(data.id)){
          this.#topRatedFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        if (this.#mostCommentedFilmsMap.has(data.id)) {
          this.#mostCommentedFilmsMap.get(data.id).init(data, this.comments, this.#filmsModel);
        }
        if (document.querySelector('.film-details')) {
          this.#popupComponent.init(data, this.comments, this.#filmsModel);
        }
        this.#clearHeader();
        this.#renderHeader();
        this.#clearNavigation();
        this.#renderNavigation();
        if (this.#listNoEmptyComponent) {
          remove(this.#listNoEmptyComponent);
        }
        break;
      case UpdateType.PATCH:
        this.#clearBoard(true);
        this.#renderBoard();
        if (document.querySelector('.film-details')) {
          this.#popupComponent.init(data, this.comments, this.#filmsModel);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if (document.querySelector('.film-details')) {
          this.#popupComponent.init(data, this.comments, this.#filmsModel);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderStats();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#headerComponent);
        remove(this.#navigationComponent);
        remove(this.#loadingComponent);
        remove(this.#footerComponent);
        this.#renderBoard();
        this.#renderFooter();
        break;
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
    this.#sortingType = SortType.DEFAULT;
    this.#filmsModel.setNavigation(UpdateType.MINOR, navigationType);
  }

  #handleStatsClick = (navigationType) => {
    if (this.#filmsModel.navigation === navigationType) {
      return;
    }

    this.#filmsModel.setNavigation(UpdateType.MAJOR, navigationType);
  }

  #handlePopupOpen = (id) => {
    if (document.querySelector('.film-details')) {
      this.#popupComponent.destroy();
    }
    const indexFilm = this.films.findIndex((film) => film.id === id);
    this.#popupComponent = new PopupPresenter(this.#handleViewAction, this.#commentsModel);
    document.body.classList.add('hide-overflow');
    this.#popupComponent.init(this.films[indexFilm], this.#filmsModel);
  }
}

import SortView from '../view/sort';
import FilmsView from '../view/films';
import ListEmptyView from '../view/list-empty';
import MainFilmsListView from '../view/main-films-list';
import TopRatedFilmsView from '../view/top-rated-films-list';
import MostCommentedFilmsListView from '../view/most-commented-films-list';
import {remove, render} from '../utils/render';
import NavigationView from '../view/navigation';
import {FilmsContainer, FilmsQuantity, Position, SortType} from '../const';
import FilmsListContainerView from '../view/films-list-container';
import StatisticsView from '../view/statistics';
import ButtonShowMoreView from '../view/show-more-button';
import FilmPresenter from './film-presenter';
import {updateItem} from '../utils/util';
import dayjs from 'dayjs';


const FILM_CARD_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsData = [];
  #commentsData = [];
  #defaultFilmData = [];


  #filmsContainerComponent = new FilmsView();
  #listNoEmptyComponent = new ListEmptyView();
  #mainFilmsListComponent = null;
  #topRatedFilmsListComponent = null;
  #mostCommentedFilmsListComponent = null;
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #sortComponent = null;

  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #mainFilmsMap = new Map();
  #topRatedFilmsMap = new Map();
  #mostCommentedFilmsMap = new Map();
  #sortingType = SortType.DEFAULT;

  constructor (container) {
    this.#mainContainer = container;
  }

  init = (filmsData, commentsData) => {
    this.#filmsData = [...filmsData];
    this.#commentsData = [...commentsData];
    this.#defaultFilmData = [...this.#filmsData];

    this.#renderBoard();
    this.#renderStatistics();
  }


  #renderNavigation = () => {
    render(this.#mainContainer, new NavigationView(this.#filmsData), Position.AFTERBEGIN);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView();
    render(this.#mainContainer, this.#sortComponent);
    this.#sortComponent.setSortByDefault(this.#handleSortChange);
  }

  #renderFilmCard = (filmData, container, filmsMap) => {
    const filmPresenter = new FilmPresenter(this.#handleFilmChange,  container);
    filmPresenter.init(filmData, this.#commentsData);
    filmsMap.set(filmData.id, filmPresenter);
  }

  #renderMainFilms = (container, films) => {
    this.#mainFilmsListComponent = new MainFilmsListView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MAIN_FILMS);
    render(container, this.#mainFilmsListComponent);
    render(this.#mainFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(films[i],filmsListContainer, this.#mainFilmsMap);
    }


    if (films.length >= FILM_CARD_COUNT_PER_STEP) {
      this.#renderButtonShowMore(filmsListContainer);
    }
  }

  #renderButtonShowMore = (container) => {


    render(this.#mainFilmsListComponent, this.#buttonShowMoreComponent);

    this.#buttonShowMoreComponent.setClickHandler(() => {

      this.#defaultFilmData
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(film, container, this.#mainFilmsMap));

      this.#renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#defaultFilmData.length) {
        remove(this.#buttonShowMoreComponent);
      }
    });
  }


  #renderTopRatedFilms = (container, films) => {
    this.#topRatedFilmsListComponent = new TopRatedFilmsView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.TOP_RATED);

    render(container, this.#topRatedFilmsListComponent);
    render(this.#topRatedFilmsListComponent, filmsListContainer);
    films.sort((prev, next) => next.filmInfo.totalRating - prev.filmInfo.totalRating);
    for (let i = 0; i < Math.min(films.length, FilmsQuantity.TOP_RATED); i++) {
      this.#renderFilmCard(films[i], filmsListContainer, this.#topRatedFilmsMap);
    }
  }

  #renderMostCommentedFilms = (container, films) => {
    this.#mostCommentedFilmsListComponent = new MostCommentedFilmsListView();
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MOST_COMMENTED);

    render(container, this.#mostCommentedFilmsListComponent);
    render(this.#mostCommentedFilmsListComponent, filmsListContainer);
    films.sort((prev, next) => next.comments.length - prev.comments.length);
    for (let i = 0; i < Math.min(films.length, FilmsQuantity.MOST_COMMENTED); i++) {
      this.#renderFilmCard(films[i], filmsListContainer, this.#mostCommentedFilmsMap);
    }
  }

  #renderFilms = () => {
    if (!this.#filmsData.length) {
      render(this.#mainContainer, this.#filmsContainerComponent);
      render(this.#filmsContainerComponent, this.#listNoEmptyComponent);
    } else {
      this.#renderSort();
      render(this.#mainContainer, this.#filmsContainerComponent);
      this.#renderFilmsList(this.#filmsData);
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
    this.#renderFilms();
  }

  #renderStatistics = () => {
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    render(footerStatisticsElement, new StatisticsView(this.#filmsData));
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

  #handleFilmChange = (updateFilm) => {
    this.#filmsData = updateItem(this.#filmsData, updateFilm);

    if (this.#mainFilmsMap.has(updateFilm.id)) {
      this.#mainFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
    }

    if (this.#topRatedFilmsMap.has(updateFilm.id) ){
      this.#topRatedFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
    }

    if (this.#mostCommentedFilmsMap.has(updateFilm.id)) {

      this.#mostCommentedFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
    }
  }

  #handleSortChange = (evt) => {
    const elem = evt.target;

    if (elem.dataset.sortType === SortType.DEFAULT) {
      this.#toggleSortButton(elem);
      this.#sortingType = SortType.DEFAULT;
      this.#clearFilms();
      this.#renderFilmsList(this.#defaultFilmData);
    }

    if (elem.dataset.sortType === SortType.BY_DATE) {
      this.#toggleSortButton(elem);
      this.#sortingType = SortType.BY_DATE;
      this.#clearFilms();
      this.#filmsData.sort((prev, next) => dayjs(prev.filmInfo.release.date).diff(next.filmInfo.release.date));
      this.#renderFilmsList(this.#filmsData);
    }

    if (elem.dataset.sortType === SortType.BY_RATING) {
      this.#toggleSortButton(elem);
      this.#sortingType = SortType.BY_RATING;
      this.#clearFilms();
      this.#filmsData.sort((prev, next) => next.filmInfo.totalRating - prev.filmInfo.totalRating);
      this.#renderFilmsList(this.#filmsData);
    }
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
}

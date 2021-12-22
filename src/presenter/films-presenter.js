import SortView from '../view/sort';
import FilmsView from '../view/films';
import ListEmptyView from '../view/list-empty';
import MainFilmsListView from '../view/main-films-list';
import TopRatedFilmsView from '../view/top-rated-films-list';
import MostCommentedFilmsListView from '../view/most-commented-films-list';
import {remove, render} from '../utils/render';
import NavigationView from '../view/navigation';
import {FilmsContainer, FilmsQuantity, Position} from '../const';
import FilmsListContainerView from '../view/films-list-container';
import StatisticsView from '../view/statistics';
import ButtonShowMoreView from '../view/show-more-button';
import FilmPresenter from './film-presenter';
import {updateItem} from '../utils/util';


const FILM_CARD_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsData = [];
  #commentsData = [];

  #sortComponent = new SortView();
  #filmsContainerComponent = new FilmsView();
  #listNoEmptyComponent = new ListEmptyView();
  #mainFilmsListComponent = new MainFilmsListView();
  #topRatedFilmsListComponent = new TopRatedFilmsView();
  #mostCommentedFilmsListComponent = new MostCommentedFilmsListView();
  #buttonShowMoreComponent = new ButtonShowMoreView();


  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #mainFilmsMap = new Map();
  #topRatedFilmsMap = new Map();
  #mostCommentedFilmsMap = new Map();

  constructor (container) {
    this.#mainContainer = container;
  }

  init = (filmsData, commentsData) => {
    this.#filmsData = [...filmsData];
    this.#commentsData = [...commentsData];

    this.#renderBoard();
    this.#renderStatistics();
  }


  #renderNavigation = () => {
    render(this.#mainContainer, new NavigationView(this.#filmsData), Position.AFTERBEGIN);
  }

  #renderFilmCard = (filmData, container, filmsMap) => {
    const filmPresenter = new FilmPresenter(this.#handleFilmChange,  container);
    filmPresenter.init(filmData, this.#commentsData);
    filmsMap.set(filmData.id, filmPresenter);
  }

  #renderMainFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MAIN_FILMS);
    render(container, this.#mainFilmsListComponent);
    render(this.#mainFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FILM_CARD_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#filmsData[i],filmsListContainer, this.#mainFilmsMap);
    }


    if (this.#filmsData.length >= FILM_CARD_COUNT_PER_STEP) {
      this.#renderButtonShowMore(filmsListContainer);
    }
  }

  #renderButtonShowMore = (container) => {


    render(this.#mainFilmsListComponent, this.#buttonShowMoreComponent);

    this.#buttonShowMoreComponent.setClickHandler(() => {

      this.#filmsData
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(film, container, this.#mainFilmsMap));

      this.#renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#filmsData.length) {
        remove(this.#buttonShowMoreComponent);
      }
    });
  }


  #renderTopRatedFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.TOP_RATED);

    render(container, this.#topRatedFilmsListComponent);
    render(this.#topRatedFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FilmsQuantity.TOP_RATED); i++) {
      this.#renderFilmCard(this.#filmsData[i], filmsListContainer, this.#topRatedFilmsMap);
    }
  }

  #renderMostCommentedFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView(FilmsContainer.MOST_COMMENTED);

    render(container, this.#mostCommentedFilmsListComponent);
    render(this.#mostCommentedFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FilmsQuantity.MOST_COMMENTED); i++) {
      this.#renderFilmCard(this.#filmsData[i], filmsListContainer, this.#mostCommentedFilmsMap);
    }
  }

  #renderFilms = () => {
    if (!this.#filmsData.length) {
      render(this.#mainContainer, this.#filmsContainerComponent);
      render(this.#filmsContainerComponent, this.#listNoEmptyComponent);
    } else {
      render(this.#mainContainer, this.#sortComponent);
      render(this.#mainContainer, this.#filmsContainerComponent);
      //=>mainFilms
      this.#renderMainFilms(this.#filmsContainerComponent);
      //=>TopRated
      this.#renderTopRatedFilms(this.#filmsContainerComponent);
      //=>MostCommented
      this.#renderMostCommentedFilms(this.#filmsContainerComponent);
    }
  }

  #renderBoard = () => {
    this.#renderNavigation();
    this.#renderFilms();
  }

  #clearBoard = () => {
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
    this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }

  #handleFilmChange = (updateFilm) => {
    this.#filmsData = updateItem(this.#filmsData, updateFilm);
    this.#mainFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
    if (this.#topRatedFilmsMap.has(updateFilm.id) && this.#mostCommentedFilmsMap.has(updateFilm.id)) {
      this.#topRatedFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
      this.#mostCommentedFilmsMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
    }
  }

  #renderStatistics = () => {
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    render(footerStatisticsElement, new StatisticsView(this.#filmsData));
  }
}

import SortView from '../view/sort';
import FilmsView from '../view/films';
import ListEmptyView from '../view/list-empty';
import MainFilmsListView from '../view/main-films-list';
import TopRatedFilmsView from '../view/top-rated-films-list';
import MostCommentedFilmsListView from '../view/most-commented-films-list';
import {remove, render} from '../utils/render';
import NavigationView from '../view/navigation';
import {FilmsQuantity, Position} from '../const';
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
  #filmsDataMap = new Map();

  constructor (container) {
    this.#mainContainer = container;
  }

  init = (filmsData, commentsData) => {
    this.#filmsData = [...filmsData];
    this.#commentsData = [...commentsData];

    this.#renderBoard();
    this.#renderStatistics();
    console.log(this.#filmsDataMap);
  }

  #renderNavigation = () => {
    render(this.#mainContainer, new NavigationView(this.#filmsData), Position.AFTERBEGIN);
  }

  #renderFilmCard = (container, filmData) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);

    filmPresenter.init(filmData, this.#commentsData);
    this.#filmsDataMap.set(filmData.id, filmPresenter);
  }

  #renderMainFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView();
    render(container, this.#mainFilmsListComponent);
    render(this.#mainFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FILM_CARD_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(filmsListContainer, this.#filmsData[i]);
    }

    if (this.#filmsData.length >= FILM_CARD_COUNT_PER_STEP) {
      this.#renderButtonShowMore();
    }
  }

  #renderButtonShowMore = () => {


    render(this.#mainFilmsListComponent, this.#buttonShowMoreComponent);

    this.#buttonShowMoreComponent.setClickHandler(() => {

      this.#filmsData
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(this.#mainFilmsListComponent.element.querySelector('.films-list__container'), film));

      this.#renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#filmsData.length) {
        remove(this.#buttonShowMoreComponent);
      }
    });
  }


  #renderTopRatedFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView();

    render(container, this.#topRatedFilmsListComponent);
    render(this.#topRatedFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FilmsQuantity.TOP_RATED); i++) {
      this.#renderFilmCard(filmsListContainer, this.#filmsData[i], this.#commentsData);
    }
  }

  #renderMostCommentedFilms = (container) => {
    const filmsListContainer = new FilmsListContainerView();

    render(container, this.#mostCommentedFilmsListComponent);
    render(this.#mostCommentedFilmsListComponent, filmsListContainer);

    for (let i = 0; i < Math.min(this.#filmsData.length, FilmsQuantity.MOST_COMMENTED); i++) {
      this.#renderFilmCard(filmsListContainer, this.#filmsData[i], this.#commentsData);
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
    this.#filmsDataMap.forEach((filmPresenter) => {
      filmPresenter.destroy();
    });
    this.#filmsDataMap.clear();
    this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }

  #handleFilmChange = (updateFilm) => {
    this.#filmsData = updateItem(this.#filmsData, updateFilm);
    this.#filmsDataMap.get(updateFilm.id).init(updateFilm, this.#commentsData);
  }

  #renderStatistics = () => {
    const footerStatisticsElement = document.querySelector('.footer__statistics');
    render(footerStatisticsElement, new StatisticsView(this.#filmsData));
  }
}

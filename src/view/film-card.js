import {generateFormatDate, getTimeFromMins} from '../utils/date';
import {FormateDate} from '../const';
import AbstractComponentView from './abstract-component';

const MAX_QUANTITY_SYMBOL = 140;

const createFilmCardElement = (data) => {
  const {
    id,
    filmInfo:{
      title,
      totalRating,
      release: {
        date
      },
      runtime,
      genre,
      description,
      poster
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    },
    comments
  } = data;

  return (`<article class="film-card" data-id-card="${id}">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${generateFormatDate(date, FormateDate.YEAR)}</span>
              <span class="film-card__duration">${getTimeFromMins(runtime)}</span>
              <span class="film-card__genre">${genre[0]}</span>
            </p>
            <img src="./${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description.length >= MAX_QUANTITY_SYMBOL ? `${description.slice(0,MAX_QUANTITY_SYMBOL - 1)}...` : description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls" data-id-button="${id}">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
          </div>
        </article>`);
};

export default class FilmsCardView extends AbstractComponentView {
  #data = null;

  constructor (data) {
    super();
    this.#data = data;
  }

  get template () {
    return createFilmCardElement(this.#data);
  }

  setOpenPopup = (callback) => {
    this._callback.clickCardElement = callback;

    this
      .element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickCardHandler);
  }

  setAddToWatchlist = (callback) => {
    this._callback.clickAddToWatchlistButton = callback;
    this
      .element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#clickAddToWatchlist);
  }

  setAlreadyWatched = (callback) => {
    this._callback.clickAlreadyWatchedButton = callback;
    this
      .element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#clickAlreadyWatched);
  }

  setAddToFavorite = (callback) => {
    this._callback.clickAddToFavoriteButton = callback;

    this
      .element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#clickAddToFavorite);
  }

  #clickCardHandler = (evt) => {

    evt.preventDefault();

    this._callback.clickCardElement(evt);

  }

  #clickAlreadyWatched = (evt) => {
    evt.preventDefault();

    this._callback.clickAlreadyWatchedButton();
  }

  #clickAddToWatchlist = (evt) => {
    evt.preventDefault();

    this._callback.clickAddToWatchlistButton();
  }

  #clickAddToFavorite = (evt) => {
    evt.preventDefault();

    this._callback.clickAddToFavoriteButton();
  }
}

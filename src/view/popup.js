import {generateFormatDate, getTimeFromMins} from '../utils/date';
import {FormateDate} from '../const';
import SmartView from './smart';
import he from 'he';

const createGenreElement = (genres) => {
  let elem = '';
  for (let i = 0; i < genres.length; i++) {
    elem += `<span class="film-details__genre">${genres[i]}</span>`;
  }

  return elem;
};

const gettingComments = (data, id) => {
  const arr = [];

  for(let i = 0; i < data.length; i++) {
    if (id.includes(data[i].id)) {
      arr.push(data[i]);
    }
  }

  return arr;
};

const createCommentsElement = (data, filmId) => {
  let element = '';

  for (let i = 0; i < data.length; i++) {
    const {
      id,
      author,
      comment: text,
      date: time,
      emotion
    } = data[i];

    element += `
      <li class="film-details__comment" data-id-film="${filmId}" data-id-comment="${id}">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(text)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${generateFormatDate(time, FormateDate.COMMENTS_DATE)}</span>
                <button class="film-details__comment-delete" data-id-comment="${id}">Delete</button>
              </p>
            </div>
          </li>`;
  }
  return element;
};

const createPopupElement = (filmData, commentsData) => {
  const {
    id,
    filmInfo:{
      title,
      totalRating,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description,
      poster,
      alternativeTitle,
      ageRating,
      director,
      writers,
      actors
    },
    comments: commentsId,
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    },
  } = filmData;


  const comments = gettingComments(commentsData, commentsId);

  return (`<section class="film-details" data-id-card="${id}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${generateFormatDate(date, FormateDate.FULL)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimeFromMins(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${createGenreElement(genre)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls" data-id-button="${id}">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button  film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsId.length}</span></h3>

        <ul class="film-details__comments-list">
            ${createCommentsElement(comments, id)}
        </ul>


      </section>
    </div>
  </form>
</section>`
  );
};

export default class PopupView extends SmartView {
  #filmData = null;
  #commentsData = null;

  constructor (filmData, commentsData) {
    super();
    this.#filmData = filmData;
    this.#commentsData = commentsData;

    this.#setInnerHandlers();
  }

  get template () {
    return createPopupElement(this.#filmData,this.#commentsData);
  }

  setRemovePopup = (callback) => {
    this._callback.clickRemovePopup = callback;

    this
      .element
      .querySelector('.film-details__close-btn')
      .addEventListener('click',this.#clickRemovePopupHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setDeleteComment(this._callback.deleteComment);
    this.setRemovePopup(this._callback.clickRemovePopup);
  }

  setAddToWatchlist = (callback) => {
    this._callback.clickAddToWatchlistButton = callback;
    this
      .element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#clickAddToWatchlist);
  }

  setAlreadyWatched = (callback) => {
    this._callback.clickAlreadyWatchedButton = callback;
    this
      .element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#clickAlreadyWatched);
  }

  setAddToFavorite = (callback) => {
    this._callback.clickAddToFavoriteButton = callback;
    this
      .element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#clickAddToFavorite);
  }

  setDeleteComment = (callback) => {
    this._callback.deleteComment = callback;
    this
      .element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((comment) => {
        comment.addEventListener('click', this.#clickDeleteComment);
      });
  }

  #setInnerHandlers = () => {
    this
      .element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#clickAddToWatchlist);
    this
      .element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#clickAlreadyWatched);
    this
      .element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#clickAddToFavorite);

  }

  #clickRemovePopupHandler = () => {
    this._callback.clickRemovePopup();
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

  #clickDeleteComment = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment(evt.target.dataset.idComment);
  }


}

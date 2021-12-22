import {generateFormatDate, getTimeFromMins} from '../utils/date';
import {FormateDate} from '../const';
import AbstractComponentView from './abstract-component';

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

const createCommentsElement = (data) => {
  let element = '';

  for (let i = 0; i < data.length; i++) {
    const {
      author,
      comments: text,
      date: time,
      emotion
    } = data[i];

    element += `
      <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${generateFormatDate(time, FormateDate.COMMENTS_DATE)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
  }
  return element;
};

export const createPopupElement = (filmData, commentsData) => {
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
      alternateTitle,
      ageRating,
      director,
      writers,
      actors
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    },
    comments: commentsId
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
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternateTitle}</p>
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
              <td class="film-details__term">Genres</td>
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
            ${createCommentsElement(comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class PopupView extends AbstractComponentView {
  #filmData = null;
  #commentsData = null;

  constructor (filmData, commentsData) {
    super();
    this.#filmData = filmData;
    this.#commentsData = commentsData;
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
}

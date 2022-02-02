import FilmsCardView from '../view/film-card';
import {remove, render, replace} from '../utils/render';
import {NavigationActionType, UpdateType, UserAction} from '../const';


export default class FilmPresenter {
  #container = null;
  #filmData = null;
  #commentsData = null;
  #filmComponent = null;

  #changeData = null;
  #changePopup = null;
  #filmsModel = null;


  constructor (changeData, container, changePopup) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changePopup = changePopup;
  }

  init = (filmData, commentsData, filmsModel) => {

    this.#filmData = filmData;
    this.#commentsData = commentsData;
    this.#filmsModel = filmsModel;


    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmsCardView(this.#filmData);

    this.#setFilmHandler();

    if (prevFilmComponent === null ) {
      render(this.#container, this.#filmComponent);
      return;
    }

    if (this.#container.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);

  }

  #setFilmHandler = () => {
    this.#filmComponent.setOpenPopup(this.#openPopup);
    this.#filmComponent.setAddToWatchlist(this.#handlerAddToWatchlist);
    this.#filmComponent.setAlreadyWatched(this.#handlerAlreadyWatched);
    this.#filmComponent.setAddToFavorite(this.#handlerAddToFavorite);
  }

  #openPopup = (evt) => {
    this.#changePopup(evt.target.offsetParent.dataset.idCard);
  }

  #handlerAddToWatchlist = () => {
    if (this.#filmsModel.navigation === NavigationActionType.ALL_MOVIES) {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PRE_PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            watchlist: !this.#filmData.userDetails.watchlist
          }
        }
      );
    } else {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            watchlist: !this.#filmData.userDetails.watchlist
          }
        }
      );
    }
  }

  #handlerAlreadyWatched = () => {
    if (this.#filmsModel.navigation === NavigationActionType.ALL_MOVIES) {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PRE_PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            alreadyWatched: !this.#filmData.userDetails.alreadyWatched
          }
        }
      );
    } else {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            alreadyWatched: !this.#filmData.userDetails.alreadyWatched
          }
        }
      );
    }
  }

  #handlerAddToFavorite = () => {
    if (this.#filmsModel.navigation === NavigationActionType.ALL_MOVIES) {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PRE_PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            favorite: !this.#filmData.userDetails.favorite
          }
        }
      );
    } else {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.PATCH,
        {
          ...this.#filmData,
          userDetails: {
            ...this.#filmData.userDetails,
            favorite: !this.#filmData.userDetails.favorite
          }
        }
      );
    }
  }

}


import FilmsCardView from '../view/film-card';
import {remove, render, replace} from '../utils/render';
import PopupView from '../view/popup';
import {NavigationActionType, UpdateType, UserAction} from '../const';
import NewCommentPopup from '../view/new-comment-popup';

export default class FilmPresenter {
  #container = null;
  #filmData = null;
  #commentsData = null;
  #filmComponent = null;
  #popupComponent = null;
  #newCommentComponent = null;
  #changeData = null;
  #filmsModel = null;


  constructor (changeData, container) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (filmData, commentsData, filmsModel) => {

    this.#filmData = filmData;
    this.#commentsData = commentsData;
    this.#filmsModel = filmsModel;


    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmsCardView(this.#filmData);
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#filmData, this.#commentsData);


    this.#setFilmHandler();
    this.#setPopupHandler();

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#container, this.#filmComponent);
      return;
    }

    if (this.#container.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (document.body.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
      render(this.#popupComponent.element.querySelector('.film-details__comments-wrap'), this.#newCommentComponent);
      this.#popupComponent.restoreHandlers();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  }

  #setFilmHandler = () => {
    this.#filmComponent.setOpenPopup(this.#openPopup);
    this.#filmComponent.setAddToWatchlist(this.#handlerAddToWatchlist);
    this.#filmComponent.setAlreadyWatched(this.#handlerAlreadyWatched);
    this.#filmComponent.setAddToFavorite(this.#handlerAddToFavorite);
  }

  #openPopup = () => {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this.#popupComponent.restoreHandlers();
    this.#setPopupHandler();
    render(document.body, this.#popupComponent);
    this.#newCommentComponent = new NewCommentPopup();
    this.#newCommentComponent.setAddEmotion();
    this.#newCommentComponent.setAddCommentText();
    this.#newCommentComponent.setSubmitComment(this.#handlerAddComment);
    render(this.#popupComponent.element.querySelector('.film-details__comments-wrap'), this.#newCommentComponent);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
  }

  #removePopup = () => {
    remove(this.#popupComponent);

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
  }

  #onEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    }
  }

  #setPopupHandler = () => {
    this.#popupComponent.setRemovePopup(this.#removePopup);
    this.#popupComponent.setAddToWatchlist(this.#handlerAddToWatchlist);
    this.#popupComponent.setAlreadyWatched(this.#handlerAlreadyWatched);
    this.#popupComponent.setAddToFavorite(this.#handlerAddToFavorite);
    this.#popupComponent.setDeleteComment(this.#handlerDeleteComment);
  }

  #handlerAddToWatchlist = () => {
    if (this.#filmsModel.navigation === NavigationActionType.ALL_MOVIES) {
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
    } else {
      this.#changeData(
        UserAction.UPDATE_FILM_DETAILS,
        UpdateType.MINOR,
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
        UpdateType.PATCH,
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
        UpdateType.MINOR,
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
        UpdateType.PATCH,
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
        UpdateType.MINOR,
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

  #handlerDeleteComment = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this.#filmData, commentId: commentId}
    );
  }

  #handlerAddComment = (newComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...this.#filmData, newComment: newComment}
    );
  }
}


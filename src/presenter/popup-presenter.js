import PopupView from '../view/popup';
import {remove, render, replace} from '../utils/render';
import NewCommentPopup from '../view/new-comment-popup';
import {NavigationActionType, UpdateType, UserAction} from '../const';

export default class PopupPresenter {
  #popupComponent = null;
  #newCommentComponent = null;

  #filmData = null;
  #commentData = null;

  #changeData = null;

  #filmsModel = null;

  constructor(changeData) {
    this.#changeData = changeData;
  }

  init = (filmData, commentData, filmsModel) => {
    this.#filmData = filmData;
    this.#commentData = commentData;

    this.#filmsModel = filmsModel;


    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#filmData, this.#commentData);
    const prevNewComment = this.#newCommentComponent;


    this.#setPopupHandler();

    if (prevPopupComponent === null) {
      this.#newCommentComponent = new NewCommentPopup();
      this .#setNewCommentHandler();
      render(document.body, this.#popupComponent);
      render(this.#popupComponent.element.querySelector('.film-details__comments-wrap'), this.#newCommentComponent);
      return;
    }


    if (document.body.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
      render(this.#popupComponent.element.querySelector('.film-details__comments-wrap'), prevNewComment);
      this.#popupComponent.restoreHandlers();
      this.#newCommentComponent.restoreHandlers();
    }

    remove(prevPopupComponent);
  }

  destroy = () => {
    remove(this.#popupComponent);
    remove(this.#newCommentComponent);
  }

  #closePopupHandler = () => {
    remove(this.#popupComponent);
    remove(this.#newCommentComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
  }

  #onEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopupHandler();
      document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    }
  }

  #setPopupHandler = () => {
    this.#popupComponent.setRemovePopup(this.#closePopupHandler);
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
    this.#popupComponent.setAddToWatchlist(this.#handlerAddToWatchlist);
    this.#popupComponent.setAlreadyWatched(this.#handlerAlreadyWatched);
    this.#popupComponent.setAddToFavorite(this.#handlerAddToFavorite);
    this.#popupComponent.setDeleteComment(this.#handlerDeleteComment);
  }

  #setNewCommentHandler = () => {
    this.#newCommentComponent.setAddEmotion();
    this.#newCommentComponent.setAddCommentText();
    this.#newCommentComponent.setSubmitComment(this.#handlerAddComment);
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

  #handlerDeleteComment = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PRE_PATCH,
      {...this.#filmData, commentId: commentId}
    );
  }

  #handlerAddComment = (newComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PRE_PATCH,
      {...this.#filmData, newComment: newComment}
    );
  }
}

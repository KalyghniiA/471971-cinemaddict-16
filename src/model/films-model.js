import AbstractObservable from '../utils/abstract-observable';
import {NavigationActionType} from '../const';

export default class FilmsModel extends AbstractObservable {
  #films = [];
  #comments = [];

  #navigation = NavigationActionType.ALL_MOVIES;

  set films (films) {
    this.#films = [...films];
  }

  get films () {
    return this.#films;
  }

  set comments (comments) {
    this.#comments = [...comments];
  }

  get comments () {
    return this.#comments;
  }

  get navigation () {
    return this.#navigation;
  }

  setNavigation = (updateType, navigation) => {
    this.#navigation = navigation;
    this._notify(updateType, navigation);
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addComment = (updateType, update) => {
    const newComment = update.newComment;
    this.#comments = [...this.#comments, newComment];
    update.comments.push(newComment.id);

    delete update.newComment;

    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const {commentId} = update;

    const commentIndex = this.#comments.findIndex((comment) => comment.id === commentId);

    this.#comments = [
      ...this.#comments.slice(0, commentIndex),
      ...this.#comments.slice(commentIndex + 1)
    ];

    const commentsCurrentFilms = update.comments;
    const filteredComments = commentsCurrentFilms.filter((comment) => comment !== update.commentId);
    delete update.commentId;
    update.comments = filteredComments;

    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];


    this._notify(updateType, update);
  }

}

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

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  setNavigation = (updateType, navigation) => {
    this.#navigation = navigation;
    this._notify(updateType, navigation);
  }

  /*addComments = (updateType, update) => {

 }*/

  deleteComment = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

}

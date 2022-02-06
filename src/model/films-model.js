import AbstractObservable from '../utils/abstract-observable';
import {NavigationActionType, UpdateType} from '../const';
import dayjs from 'dayjs';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];
  #comments = [];

  #navigation = NavigationActionType.ALL_MOVIES;

  constructor(apiService) {
    super();

    this.#apiService = apiService;

  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptFilmToClient);

    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }


  get films() {
    return this.#films;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  get navigation() {
    return this.#navigation;
  }


  #adaptFilmToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film['film_info'],
        ageRating: film['film_info']['age_rating'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        release: {
          date: film['film_info']['release']['date'],
          releaseCountry: film['film_info']['release']['release_country'],
        }
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
      },
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm['filmInfo']['age_rating'];
    delete adaptedFilm['filmInfo']['alternative_title'];
    delete adaptedFilm['filmInfo']['total_rating'];
    delete adaptedFilm['userDetails']['already_watched'];
    delete adaptedFilm['userDetails']['watching_date'];

    return adaptedFilm;
  }

  setNavigation = (updateType, navigation) => {
    this.#navigation = navigation;
    this._notify(updateType, navigation);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    try {
      const response = await this.#apiService.updateFilm(update);
      const updateFilm = this.#adaptFilmToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }

  }

  addComment = async (updateType, update) => {
    console.log(update);

    const newComment = update.newComment;
    update.comments.push(newComment.id);
    delete update.newComment;

    const index = this.#films.findIndex((film) => film.id === update.id);

    try {
      const response = await this.#apiService.updateFilm(update);

      const updateFilm = this.#adaptFilmToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }

  }
}

import AbstractObservable from '../utils/abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #filmId = null
  #comments = [];

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (filmId) => {
    this.#filmId = filmId;
    try {
      this.#comments = await this.#apiService.getComments(this.#filmId);
    } catch (err) {
      this.#comments = [];
    }
  }

  addComment = async (updateType, update) => {
    try {
      const resp = await this.#apiService.addComment(update.newComment, update.id);
      delete update.newComment;
      this.#comments = await this.#apiService.getComments(this.#filmId);

      this._notify(updateType, this.#adaptToClient(resp.movie));
    } catch(err) {
      throw new Error('Can\'t add new comment');
    }
  }

  deleteComment = async (updateType, update) => {
    try {
      await this.#apiService.deleteComment(update.commentId);

      const commentIndex = update.comments.findIndex((comment) => comment === update.commentId);
      update.comments = [
        ...update.comments.slice(0, commentIndex),
        ...update.comments.slice(commentIndex + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }

  }

  #adaptToClient = (film) => {
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
}

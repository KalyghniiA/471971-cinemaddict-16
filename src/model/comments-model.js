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
      await this.#apiService.addComment(update.newComment, this.#filmId);
      delete update.newComment;
      this.#comments = await this.#apiService.getComments(this.#filmId);

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add new comment');
    }
  }

  /*deleteComment = (updateType, update) => {
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
  }*/
}

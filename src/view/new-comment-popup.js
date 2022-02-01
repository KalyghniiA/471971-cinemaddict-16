import SmartView from './smart';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

//
const createNewCommentElement = (data) => {
  const {commentEmotion, commentText} = data;

  return (`<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${commentEmotion ? `<img src="./images/emoji/${commentEmotion}.png" width="55" height="55" alt="emoji">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText ? commentText : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${commentEmotion === 'smile' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${commentEmotion === 'sleeping' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${commentEmotion === 'puke' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${commentEmotion === 'angry' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>`);
};


export default class NewCommentPopup extends SmartView {
  #commentText = '';

  #keyHandler = {
    control: false,
    enter: false,
  };

  constructor() {
    super();

    this._data = this.ParseCommentToData();


  }

  get template () {
    return createNewCommentElement(this._data);
  }

  ParseCommentToData = () => ({
    commentEmotion: null,
    commentText: null,
  })

  ParseDataToComment = (data) => {
    const {
      commentEmotion,
      commentText,
    } = data;

    const newComment = {
      id: nanoid(),
      author: 'moke',
      comments: commentText,
      date: dayjs(),
      emotion: commentEmotion,
    };

    delete this._data.commentText;
    delete this._data.commentEmotion;

    return newComment;
  }

  restoreHandlers = () => {
    this.setAddEmotion();
    this.setAddCommentText();
    this.setSubmitComment(this._callback.submitComment);
  }

  setAddEmotion = () => {
    this
      .element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((elem) => {
        elem.addEventListener('click', this.#handlerClickAddEmotion);
      });
  }

  setAddCommentText = () => {
    this
      .element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#handlerInputComment);
  }

  setSubmitComment = (callback) => {
    this._callback.submitComment = callback;
    this
      .element
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#handlerSubmitComment);
  }

  #handlerClickAddEmotion = (evt) => {
    this.updateData(
      {
        commentEmotion: evt.target.value,
        commentText: this.#commentText ? this.#commentText : this._data.commentText}
    );
  }

  #handlerInputComment = (evt) => {
    this._data.commentText = evt.target.value;

  }

  #handlerSubmitComment = (evt) => {

    if (evt.key === 'Control') {
      this.#keyHandler.control = true;
    }

    if (evt.key === 'Enter') {
      this.#keyHandler.enter = true;
    }

    if (this.#keyHandler.control && this.#keyHandler.enter) {
      if (!this._data.commentText || !this._data.commentEmotion) {
        this.element.querySelector('.film-details__comment-input').setCustomValidity('Требуется заполнить комментарий и указать эмоцию');
        return;
      }
      this.#keyHandler.enter = null;
      this.#keyHandler.control = null;
      this._callback.submitComment(this.ParseDataToComment(this._data));
      this.updateElement();
    }
  }
}

import {createElement} from '../utils/render';

const createFilmListContainerElement = () => (
  `<div class="films-list__container">

      </div>`
);

export default class FilmsListContainerView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmListContainerElement();
  }

  removeElement () {
    this.#element = null;
  }
}

import {createElement} from '../utils/render';

const createFilmsElement = () => (
  `<section class="films">

  </section>`
);

export default class FilmsView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmsElement();
  }

  removeElement () {
    this.#element = null;
  }
}

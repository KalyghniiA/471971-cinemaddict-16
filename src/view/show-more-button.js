import {createElement} from '../utils/render';

const createButtonShowMoreElement = () => (
  '<button class="films-list__show-more">Show more</button>'
);


export default class ButtonShowMoreView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createButtonShowMoreElement();
  }

  removeElement () {
    this.#element = null;
  }
}

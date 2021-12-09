import {createElement} from '../utils/render';

export default class AbstractComponentView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractComponentView) {
      throw new Error('Can\'t instantiate AbstractComponentView, only concrete one.');
    }
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement () {
    this.#element = null;
  }
}

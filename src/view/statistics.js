import {createElement} from '../utils/render';

const createStatisticElement = (data) => `<p>${data.length} movies inside</p>`;

export default class StatisticsView {
  #element = null;
  #data = null

  constructor (data) {
    this.#data = data;
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createStatisticElement(this.#data);
  }

  removeElement () {
    this.#element = null;
  }
}

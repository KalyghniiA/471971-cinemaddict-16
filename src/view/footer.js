import AbstractComponentView from './abstract-component';

const createStatisticElement = (data) => `<p>${data.length} movies inside</p>`;

export default class FooterView extends AbstractComponentView {
  #data = null

  constructor (data) {
    super();
    this.#data = data;
  }

  get template () {
    return createStatisticElement(this.#data);
  }
}

import {createElement} from '../utils/render';

const createMainFilmsListElement = () => (
  `<section class="films-list films-list--main-films">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>


    </section>`
);

export default class MainFilmsListView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createMainFilmsListElement();
  }

  removeElement () {
    this.#element = null;
  }
}

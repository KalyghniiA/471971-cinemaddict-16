import {createElement} from '../utils/render';

const createMostCommentedFilmsElement = () => (
  `<section class="films-list films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>



  </section>`
);

export default class MostCommentedFilmsListView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createMostCommentedFilmsElement();
  }

  removeElement () {
    this.#element = null;
  }
}

import {createElement} from '../utils/render';

const createTopRatedFilmsElement = () => (
  `<section class="films-list films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>


    </section>`
);

export default class TopRatedFilmsView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createTopRatedFilmsElement();
  }

  removeElement () {
    this.#element = null;
  }
}

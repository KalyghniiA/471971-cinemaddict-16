import AbstractComponentView from './abstract-component';

const createFilmListContainerElement = (dataAttribute = 'main-films') => (
  `<div class="films-list__container" data-container="${dataAttribute}">

      </div>`
);

export default class FilmsListContainerView extends AbstractComponentView{
  #attribute = null
  constructor(attribute) {
    super();
    this.#attribute = attribute;

  }

  get template () {
    return createFilmListContainerElement(this.#attribute);
  }
}

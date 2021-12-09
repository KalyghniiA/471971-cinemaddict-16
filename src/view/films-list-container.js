import AbstractComponentView from './abstract-component';

const createFilmListContainerElement = () => (
  `<div class="films-list__container">

      </div>`
);

export default class FilmsListContainerView extends AbstractComponentView{
  get template () {
    return createFilmListContainerElement();
  }
}

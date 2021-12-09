import AbstractComponentView from './abstract-component';

const createMainFilmsListElement = () => (
  `<section class="films-list films-list--main-films">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>


    </section>`
);

export default class MainFilmsListView extends AbstractComponentView {
  get template () {
    return createMainFilmsListElement();
  }
}

import AbstractComponentView from './abstract-component';

const createMostCommentedFilmsElement = () => (
  `<section class="films-list films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>



  </section>`
);

export default class MostCommentedFilmsListView extends AbstractComponentView {
  get template () {
    return createMostCommentedFilmsElement();
  }
}

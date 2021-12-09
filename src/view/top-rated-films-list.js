import AbstractComponentView from './abstract-component';

const createTopRatedFilmsElement = () => (
  `<section class="films-list films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>


    </section>`
);

export default class TopRatedFilmsView extends AbstractComponentView{
  get template () {
    return createTopRatedFilmsElement();
  }
}

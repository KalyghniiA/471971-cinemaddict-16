import AbstractComponentView from './abstract-component';


const createFilmsElement = () => (
  `<section class="films">

  </section>`
);

export default class FilmsView extends AbstractComponentView {
  get template () {
    return createFilmsElement();
  }
}

import AbstractComponentView from './abstract-component';

const createLoadingComponent = () => (`<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`);


export default class LoadingView extends AbstractComponentView {
  get template () {
    return createLoadingComponent();
  }
}


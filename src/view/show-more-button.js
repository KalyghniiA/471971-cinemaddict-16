import AbstractComponentView from './abstract-component';

const createButtonShowMoreElement = () => (
  '<button class="films-list__show-more">Show more</button>'
);


export default class ButtonShowMoreView  extends AbstractComponentView{

  get template () {
    return createButtonShowMoreElement();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}

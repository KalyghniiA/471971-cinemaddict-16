import AbstractComponentView from './abstract-component';

const createSortElement = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractComponentView{
  get template () {
    return createSortElement();
  }

  setSortByDefault = (callback) => {
    this._callback.clickSort = callback;
    this
      .element
      .querySelectorAll('.sort__button')
      .forEach((btn) => {
        btn.addEventListener('click', this.#clickSortHandler);

      });
  }

  #clickSortHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickSort(evt);
  }
}

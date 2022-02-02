import AbstractComponentView from './abstract-component';
import {SortType} from '../const';

const createSortElement = (sortingType) => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button ${sortingType === SortType.DEFAULT ? 'sort__button--active': ''}">Sort by default</a></li>
    <li><a href="#" data-sort-type="date" class="sort__button ${sortingType === SortType.BY_DATE ? 'sort__button--active': ''}">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button ${sortingType === SortType.BY_RATING ? 'sort__button--active': ''}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractComponentView{
  #sortingType = null;

  constructor(sortingType) {
    super();
    this.#sortingType = sortingType;
  }

  get template () {
    return createSortElement(this.#sortingType);
  }

  setSortClick = (callback) => {
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

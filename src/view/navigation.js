import AbstractComponentView from './abstract-component';
import {NavigationActionType} from '../const';

const createNavigationElement = (data, userAction) => (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-type="${NavigationActionType.ALL_MOVIES}" class="main-navigation__item ${userAction === NavigationActionType.ALL_MOVIES ? 'main-navigation__item--active' : ''}">All movies</a>
      <a href="#watchlist" data-type="${NavigationActionType.WATCHLIST}" class="main-navigation__item ${userAction === NavigationActionType.WATCHLIST ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${data.find((elem) => elem.type === NavigationActionType.WATCHLIST).count}</span></a>
      <a href="#history" data-type="${NavigationActionType.HISTORY}" class="main-navigation__item ${userAction === NavigationActionType.HISTORY ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${data.find((elem) => elem.type === NavigationActionType.HISTORY).count}</span></a>
      <a href="#favorites" data-type="${NavigationActionType.FAVORITES}" class="main-navigation__item ${userAction === NavigationActionType.FAVORITES ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${data.find((elem) => elem.type === NavigationActionType.FAVORITES).count}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${userAction === NavigationActionType.STATS ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`);

export default class NavigationView extends AbstractComponentView{
  #data = null;
  #userAction = null

  constructor(data, userAction) {
    super();
    this.#data = data;
    this.#userAction = userAction;
  }

  get template () {
    return createNavigationElement(this.#data, this.#userAction);
  }

  setNavigationClick = (callback) => {
    this._callback.clickNavigation = callback;
    this
      .element
      .querySelectorAll('.main-navigation__item')
      .forEach((elem) => {
        elem
          .addEventListener('click', this.#clickNavigationHandler);
      });
  }

  setStatsClick = (callback) => {
    this._callback.clickStats = callback;
    this
      .element
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this.#clickStatsHandler);
  }

  #clickNavigationHandler = (evt) => {
    if (evt.target.nodeName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.clickNavigation(evt.target.dataset.type);
  }

  #clickStatsHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickStats();
  }
}

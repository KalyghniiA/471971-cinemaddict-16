import AbstractComponentView from './abstract-component';
import {userRanks} from '../const';

const getUserRank = (value) => {
  for (const {name, min, max} of userRanks) {
    if (value >= min && value <= max) {
      return name;
    }
  }
};

const createProfileElement = (value) => (
  `<section class="header__profile profile">
    ${value > 0
    ? `<p class="profile__rating">${getUserRank(value)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">`
    : ''}
  </section>`
);

export default class ProfileView extends AbstractComponentView{
  #value = null;

  constructor(value) {
    super();

    this.#value = value;
  }

  get template () {
    return createProfileElement(this.#value);
  }
}

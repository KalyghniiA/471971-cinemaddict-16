import {Position} from './const';

export const renderElement = (container, template, place = Position.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};


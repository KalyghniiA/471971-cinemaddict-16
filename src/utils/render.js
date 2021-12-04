import {Position} from '../const';

export const render = (container, template, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.BEFOREEND:
      container.append(template);
      break;
    case Position.AFTERBEGIN:
      container.prepend(template);
      break;
    case Position.AFTEREND:
      container.after(template);
      break;
    case Position.BEFOREBEGIN:
      container.append(template);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};



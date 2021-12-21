import {Position} from '../const';
import AbstractComponentView from '../view/abstract-component';

export const render = (container, template, place = Position.BEFOREEND) => {
  const parent = container instanceof AbstractComponentView ? container.element : container;
  const child = template instanceof AbstractComponentView ? template.element : template;

  switch (place) {
    case Position.BEFOREEND:
      parent.append(child);
      break;
    case Position.AFTERBEGIN:
      parent.prepend(child);
      break;
    case Position.AFTEREND:
      parent.after(child);
      break;
    case Position.BEFOREBEGIN:
      parent.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractComponentView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractComponentView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }
  const oldScroll = oldChild.scrollTop;
  parent.replaceChild(newChild, oldChild);
  newChild.scrollTop = oldScroll;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractComponentView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

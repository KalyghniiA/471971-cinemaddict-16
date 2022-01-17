import AbstractComponentView from './abstract-component';

export default class SmartView extends AbstractComponentView {
  _filmData = {}

  restoreHandlers = () => {
    throw new Error('Can\'t instantiate SmartView, only concrete one.');
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

   this._filmData = {...this._filmData, ...update};

    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    const oldScroll = prevElement.scrollTop;
    parent.replaceChild(newElement, prevElement);
    newElement.scrollTop = oldScroll;

    this.restoreHandlers();
  }
}

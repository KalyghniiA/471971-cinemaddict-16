import PopupView from '../view/popup';
import {remove, render, replace} from '../utils/render';

export default class PopupPresenter {
  #filmData = null;
  #commentsData = null;
  #popupComponent = null;

  init = (filmData, commentsData) => {
    this.#filmData = filmData;
    this.#commentsData = commentsData;

    const prevComponent = this.#popupComponent;

    this.#popupComponent = new PopupView(this.#filmData, this.#commentsData);

    this.#popupComponent.setRemovePopup (this.#removePopup);

    this.#popupComponent.setAddToWatchlist (() => {
      console.log('add to watchlist');
    });

    this.#popupComponent.setAlreadyWatched (() => {
      console.log('alreadyWatched');
    });

    this.#popupComponent.setAddToFavorite (() => {
      console.log('add to favorite');
    });

    if (prevComponent === null) {
      if (document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }

      render(document.body, this.#popupComponent);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDownHandler);
      return;
    }

    if (document.body.contains(prevComponent.element)) {
      replace(this.#popupComponent, prevComponent);
    }

    remove (prevComponent);
  }

  destroy = () => {
    remove(this.#popupComponent);
  }

  #removePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
  }

  #onEscKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    }
  }

}



import FilmsCardView from '../view/film-card';
import {remove, render, replace} from '../utils/render';
import PopupPresenter from './popup-presenter';

export default class FilmPresenter {
  #container = null;
  #filmData = null;
  #commentsData = null;
  #filmComponent = null;
  #popupComponent = null;
  #changeData = null;

  constructor (container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init (filmData, commentsData) {
    this.#filmData = filmData;
    this.#commentsData = commentsData;

    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmsCardView(this.#filmData);



    this.#filmComponent.setOpenPopup(() => {
      this.#popupComponent = new PopupPresenter();
      this.#popupComponent.init(this.#filmData, this.#commentsData);
    });

    this.#filmComponent.setAddToWatchlist(() => {
      this.#changeData(
        {
          ...this.#filmData,
          userDetails: {
            watchlist: !this.#filmData.userDetails.watchlist
          }
        });
    });



    this.#filmComponent.setAlreadyWatched(() => {
      console.log('alreadyWatched');
    });

    this.#filmComponent.setAddToFavorite(() => {
      console.log('add to favorite');
    });

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmComponent);
      return;
    }

    if (this.#container.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }
}

import {renderElement} from './util';
import {createProfileElement} from './view/profile';
import {FilmsQuantity, Position} from './const';
import {createFilmsElement} from './view/films';
import {createNavigationElement} from './view/navigation';
import {createSortElement} from './view/sort';
import {createMainFilmsListElement} from './view/main-films-list';
import {createTopRatedFilmsElement} from './view/top-rated-films-list';
import {createMostCommentedFilmsElement} from './view/most-commented-films-list';
import {createFilmListContainerElement} from './view/films-list-container';
import {createButtonShowMoreElement} from './view/show-more-button';
import {createFilmCardElement} from './view/film-card';
import {createStatisticElement} from './view/statistics';


const headerContainerElement = document.querySelector('.header');

renderElement(headerContainerElement, createProfileElement(), Position.BEFOREEND);

const mainContainerElement = document.querySelector('.main');

renderElement(mainContainerElement, createNavigationElement(), Position.AFTERBEGIN);
renderElement(mainContainerElement, createSortElement(), Position.BEFOREEND);
renderElement(mainContainerElement, createFilmsElement(), Position.BEFOREEND);

const filmsContainer = mainContainerElement.querySelector('.films');

//mainFilms
renderElement(filmsContainer, createMainFilmsListElement(), Position.BEFOREEND);
const mainFilmsContainer = filmsContainer.querySelector('.films-list--main-films');
renderElement(mainFilmsContainer, createFilmListContainerElement(), Position.BEFOREEND);
renderElement(mainFilmsContainer, createButtonShowMoreElement(), Position.BEFOREEND);
for (let i = 0; i < FilmsQuantity.MAIN; i++) {
  renderElement(mainFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(), Position.BEFOREEND);
}

//TopRated
renderElement(filmsContainer, createTopRatedFilmsElement(), Position.BEFOREEND);
const topRatedFilmsContainer = filmsContainer.querySelector('.films-list--top-rated');
renderElement(topRatedFilmsContainer, createFilmListContainerElement(), Position.BEFOREEND);
for (let i = 0; i < FilmsQuantity.TOP_RATED; i++) {
  renderElement(topRatedFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(), Position.BEFOREEND);
}
//MostCommented
renderElement(filmsContainer, createMostCommentedFilmsElement(), Position.BEFOREEND);
const mostCommentedFilmsContainer = filmsContainer.querySelector('.films-list--most-commented');
renderElement(mostCommentedFilmsContainer, createFilmListContainerElement(), Position.BEFOREEND);
for (let i = 0; i < FilmsQuantity.MOST_COMMENTED; i++) {
  renderElement(mostCommentedFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(), Position.BEFOREEND);
}

const footerStatisticsElement = document.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, createStatisticElement(), Position.BEFOREEND);

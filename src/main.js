import {renderElement} from './utils/util';
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
import {generateComment, generateMocks} from './mock';
import {createPopupElement} from './view/popup';


//Data
const COMMENTS_COUNT = 100;
const FILM_CARD_COUNT = 20;
const FILM_CARD_COUNT_PER_STEP = 5;

const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const copyComments = JSON.parse(JSON.stringify(commentsData));
const mockData = generateMocks(copyComments, FILM_CARD_COUNT);

//Render
//=>Header
const headerContainerElement = document.querySelector('.header');

renderElement(headerContainerElement, createProfileElement());
//=> MainContainer
const mainContainerElement = document.querySelector('.main');

renderElement(mainContainerElement, createNavigationElement(mockData), Position.AFTERBEGIN);
renderElement(mainContainerElement, createSortElement());
renderElement(mainContainerElement, createFilmsElement());

const filmsContainer = mainContainerElement.querySelector('.films');

//=>mainFilms
renderElement(filmsContainer, createMainFilmsListElement());
const mainFilmsContainer = filmsContainer.querySelector('.films-list--main-films');
renderElement(mainFilmsContainer, createFilmListContainerElement());

for (let i = 0; i < Math.min(FilmsQuantity.MAIN, mockData.length); i++) {
  renderElement(mainFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(mockData[i]));
}


if (mockData.length > FILM_CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

  renderElement(mainFilmsContainer, createButtonShowMoreElement());

  const buttonShowMore = document.querySelector('.films-list__show-more');

  buttonShowMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    mockData
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
      .forEach((film) =>  renderElement(mainFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(film)));

    renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= mockData.length) {
      buttonShowMore.remove();
    }
  });
}
//=>TopRated
renderElement(filmsContainer, createTopRatedFilmsElement());
const topRatedFilmsContainer = filmsContainer.querySelector('.films-list--top-rated');
renderElement(topRatedFilmsContainer, createFilmListContainerElement());
for (let i = 0; i < Math.min(FilmsQuantity.TOP_RATED, mockData.length); i++) {
  renderElement(topRatedFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(mockData[i]));
}
//=>MostCommented
renderElement(filmsContainer, createMostCommentedFilmsElement());
const mostCommentedFilmsContainer = filmsContainer.querySelector('.films-list--most-commented');
renderElement(mostCommentedFilmsContainer, createFilmListContainerElement());
for (let i = 0; i < Math.min(FilmsQuantity.MOST_COMMENTED, mockData.length); i++) {
  renderElement(mostCommentedFilmsContainer.querySelector('.films-list__container'), createFilmCardElement(mockData[i]));
}
//=>Footer
const footerStatisticsElement = document.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, createStatisticElement(mockData));
//=>Popup
renderElement(document.body, createPopupElement(mockData[0],commentsData));



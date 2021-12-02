import {render} from './utils/render';
import ProfileView from './view/profile';
import {FilmsQuantity, Position} from './const';
import FilmsView from './view/films';
import NavigationView from './view/navigation';
import SortView from './view/sort';
import MainFilmsListView from './view/main-films-list';
import TopRatedFilmsView from './view/top-rated-films-list';
import MostCommentedFilmsListView from './view/most-commented-films-list';
import FilmsListContainerView from './view/films-list-container';
import ButtonShowMoreView from './view/show-more-button';
import FilmsCardView from './view/film-card';
import StatisticsView from './view/statistics';
import {generateComment, generateMocks} from './mock';
import PopupView from './view/popup';


//Data
const COMMENTS_COUNT = 100;
const FILM_CARD_COUNT = 20;
const FILM_CARD_COUNT_PER_STEP = 5;

const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const copyComments = JSON.parse(JSON.stringify(commentsData));
const mockData = generateMocks(copyComments, FILM_CARD_COUNT);

//Render

const renderFilm = (container, filmData, comments) => {
  const film = new FilmsCardView(filmData);


  render(container, film.element);
  //render Popup

  film
    .element
    .querySelector('.film-card__link')
    .addEventListener('click', (evt) => {
      evt.preventDefault();

      if (document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }

      const popup = new PopupView(filmData, comments);
      render(document.body, popup.element);
      document.body.classList.add('hide-overflow');

      const removePopup = () => {
        popup.element.remove();
        document.body.classList.remove('hide-overflow');
      };

      /*const onEscKeyDown = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          removePopup();
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };*/

      popup
        .element
        .querySelector('.film-details__close-btn')
        .addEventListener('click', removePopup);

    });
};

const renderMainFilms = (container, filmsData, comments) => {
  const mainFilmsListElement = new MainFilmsListView();
  const filmsListContainer = new FilmsListContainerView();


  render(container, mainFilmsListElement.element);
  render(mainFilmsListElement.element, filmsListContainer.element);
  for (let i = 0; i < Math.min(filmsData.length, FILM_CARD_COUNT_PER_STEP); i++) {
    renderFilm(filmsListContainer.element, filmsData[i], comments);
  }

  if (filmsData.length > FILM_CARD_COUNT_PER_STEP) {
    const buttonShowMore = new ButtonShowMoreView();

    let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

    render(mainFilmsListElement.element, buttonShowMore.element);

    buttonShowMore.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      filmsData
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) =>  renderFilm(filmsListContainer.element, film, comments));

      renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (renderedFilmsCount >= mockData.length) {
        buttonShowMore.element.remove();
      }
    });
  }
};

const renderTopRatedFilms = (container, filmsData, comments) => {
  const topRatedFilmsListElement = new TopRatedFilmsView();
  const filmsListContainer = new FilmsListContainerView();

  render(container, topRatedFilmsListElement.element);
  render(topRatedFilmsListElement.element, filmsListContainer.element);

  for (let i = 0; i < Math.min(filmsData.length, FilmsQuantity.TOP_RATED); i++) {
    renderFilm(filmsListContainer.element, filmsData[i], comments);
  }
};

const renderMostCommentedFilms = (container, filmsData, comments) => {
  const mostCommentedFilmsListElement = new MostCommentedFilmsListView();
  const filmsListContainer = new FilmsListContainerView();

  render(container, mostCommentedFilmsListElement.element);
  render(mostCommentedFilmsListElement.element, filmsListContainer.element);

  for (let i = 0; i < Math.min(filmsData.length, FilmsQuantity.MOST_COMMENTED); i++) {
    renderFilm(filmsListContainer.element, filmsData[i], comments);
  }
};
//=>Header
const headerContainerElement = document.querySelector('.header');

render(headerContainerElement, new ProfileView().element);
//=> MainContainer
const mainContainerElement = document.querySelector('.main');


render(mainContainerElement, new NavigationView(mockData).element, Position.AFTERBEGIN);
render(mainContainerElement, new SortView().element);

const filmsContainerElement = new FilmsView();

render(mainContainerElement, filmsContainerElement.element);
//=>mainFilms


renderMainFilms(filmsContainerElement.element, mockData, commentsData);


//=>TopRated
renderTopRatedFilms(filmsContainerElement.element, mockData, commentsData);

//=>MostCommented

renderMostCommentedFilms(filmsContainerElement.element, mockData, commentsData);

//=>Footer
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, new StatisticsView(mockData).element);

import {render} from './utils/render';
import ProfileView from './view/profile';
import {generateComment, generateMocks} from './mock';
import FilmsPresenter from './presenter/films-presenter';


//Data
const COMMENTS_COUNT = 100;
const FILM_CARD_COUNT = 20;

const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const copyComments = JSON.parse(JSON.stringify(commentsData));
const mockData = generateMocks(copyComments, FILM_CARD_COUNT);


//=>Header
const headerContainerElement = document.querySelector('.header');

render(headerContainerElement, new ProfileView());
//=> MainContainer

const movie = new FilmsPresenter(document.querySelector('.main'));
movie.init(mockData, commentsData);



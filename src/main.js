
import {generateComment, generateMocks} from './mock';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';

//Data
const COMMENTS_COUNT = 100;
const FILM_CARD_COUNT = 20;

const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const copyComments = JSON.parse(JSON.stringify(commentsData));
const mockData = generateMocks(copyComments, FILM_CARD_COUNT);

const filmsModel = new FilmsModel();


filmsModel.films = mockData;
filmsModel.comments = commentsData;

//=>Header

//=> MainContainer

const movie = new FilmsPresenter(document.querySelector('.main'),filmsModel);
//const navigation = new NavigationPresenter(document.querySelector('.main'), navigationModel, filmsModel);

//navigation.init();
movie.init();



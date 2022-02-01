import {render} from './utils/render';
import ProfileView from './view/profile';
import {generateComment, generateMocks} from './mock';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import {filter} from './utils/filter';
import {NavigationActionType} from './const';


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
const headerContainerElement = document.querySelector('.header');
const profileValue = filter[NavigationActionType.HISTORY](filmsModel.films).length;
render(headerContainerElement, new ProfileView(profileValue));
//=> MainContainer

const movie = new FilmsPresenter(document.querySelector('.main'),filmsModel);
//const navigation = new NavigationPresenter(document.querySelector('.main'), navigationModel, filmsModel);

//navigation.init();
movie.init();



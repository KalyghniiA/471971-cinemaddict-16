

import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import ApiService from './api-service';
import CommentsModel from './model/comments-model';

//Data
const AUTHORIZATION = 'Basic oiklcv324';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const mainContainer = document.querySelector('.main');

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

const movie = new FilmsPresenter(mainContainer,filmsModel, commentsModel);

//navigation.init();
movie.init();

filmsModel.init();



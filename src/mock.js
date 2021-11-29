import {nanoid} from 'nanoid';
import {deleteItemInArray, getRandomElementInArray, getRandomFloat, getRandomIntInclusive} from './utils/util';
import {creationDate} from './utils/date';

const MOVIE_TITLE = [
  'The Third Man',
  'Brief Encounter',
  'Lawrence of Arabia',
  'The 39 Steps',
  'Great Expectations',
  'Kind Hearts and Coronets',
  'Kes',
  'Don’t Look Now',
  'The Red Shoes',
  'Trainspotting',
  'The Bridge on the River Kwai',
];

const MOVIE_POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const MOVIE_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const MOVIE_AGE_RATING = [
  '0',
  '6',
  '12',
  '16',
  '18+',
];

const MOVIE_DIRECTOR = [
  'Lee Unkrich',
  'George Lucas',
  'Sam Raimi',
  'Roland Emmerich',
  'Ron Howard',
  'Tim Burton',
  'Gore Verbinski',
  'Chris Columbus',
  'Robert Zemeckis',
  'David Yates',
  'Christopher Nolan',
  'Michael Bay',
  'James Cameron',
  'Peter Jackson',
  'Steven Spielberg',
];

const MOVIE_ACTORS = [
  'Jack Nicholson',
  'Marlon Brando',
  'Robert De Niro',
  'Al Pacino',
  'Daniel Day-Lewis',
  'Dustin Hoffman',
  'Tom Hanks',
  'Anthony Hopkins',
  'Paul Newman',
  'Denzel Washington',
  'Spencer Tracy',
  'Laurence Olivier',
  'Jack Lemmon',
  'Michael Caine',
  'James Stewart',
  'Robin Williams',
  'Robert Duvall',
  'Sean Penn',
  'Morgan Freeman',
  'Jeff Bridges',
  'Sidney Poitier',
];

const MOVIE_WRITERS = [
  'William Shakespeare',
  'George Orwell',
  'Charles Dickens',
  'Leo Tolstoy',
  'Jane Austen',
  'Ernest Hemingway',
  'Homer',
  'John Steinbeck',
  'James Joyce',
  'Mark Twain',
  'Alexandre Dumas',
  'Vladimir Nabokov',
  'Robert Frost',
  'Virgil',
  'William Wordsworth',
  'Oscar Wilde',
  'Gabriel Garcia Marquez',
  'Victor Hugo',
];

const MOVIE_COUNTRY = [
  'Canada',
  'Japan',
  'Germany',
  'Switzerland',
  'Australia',
  'United States',
  'New Zealand',
  'United Kingdom',
  'Sweden',
  'Netherlands',
  'France',
];

const MOVIE_GENRE = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
];

const COMMENT_EMOTION = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];


const Rating = {
  MIN: 0,
  MAX: 10,
  PRECISION: 1,
};

const RunTime = {
  MIN: 60,
  MAX: 180,
};

const MaxQuantityElement = {
  WRITERS: 3,
  ACTORS: 5,
  GENRE: 3,
  DESCRIPTION: 5,
};

const MovieCreationDateRange = {
  MIN: -500,
  MAX: -10000,
};

const WatchingDateRange = {
  MIN: 0,
  MAX: -30,
};

const CommentsCreateDateRange = {
  MIN: 0,
  MAX: -15,
};

const MAX_COMMENTS_COUNT = 5;

const generateElementInArray = (quantity, newArr, elements) => {
  for (let i = 0; i < quantity; i++) {
    newArr.add(getRandomElementInArray(elements));
  }
};

export const generateComment = () => ({
  id: nanoid(),
  author: getRandomElementInArray(MOVIE_ACTORS),
  comments: getRandomElementInArray(MOVIE_DESCRIPTION),
  date: creationDate(CommentsCreateDateRange.MIN, CommentsCreateDateRange.MAX),
  emotion: getRandomElementInArray(COMMENT_EMOTION),
});

export const gettingIdComment = (comments) => {
  const arr = [];
  const count = getRandomIntInclusive(1, MAX_COMMENTS_COUNT);

  for (let i = 0; i < count; i++) {
    const element = getRandomElementInArray(comments);
    arr.push(element.id);
    deleteItemInArray(comments, element);
  }

  return arr;
};

const generateMock = (comments) => {
  const writers = new Set;
  const description = new Set;
  const actors = new Set;
  const genre = new Set;

  generateElementInArray(MaxQuantityElement.WRITERS, writers, MOVIE_WRITERS);
  generateElementInArray(MaxQuantityElement.DESCRIPTION, description, MOVIE_DESCRIPTION);
  generateElementInArray(MaxQuantityElement.ACTORS, actors, MOVIE_ACTORS);
  generateElementInArray(MaxQuantityElement.GENRE, genre, MOVIE_GENRE);

  return {
    id: nanoid(),
    comments: gettingIdComment(comments),
    filmInfo: {
      title: getRandomElementInArray(MOVIE_TITLE),
      alternateTitle: getRandomElementInArray(MOVIE_TITLE),
      totalRating: getRandomFloat(Rating.MIN, Rating.MAX, Rating.PRECISION),
      poster: getRandomElementInArray(MOVIE_POSTERS),
      ageRating: getRandomElementInArray(MOVIE_AGE_RATING),
      director: getRandomElementInArray(MOVIE_DIRECTOR),
      writers: Array.from(writers),
      actors: Array.from(actors),
      release: {
        date: creationDate(MovieCreationDateRange.MIN, MovieCreationDateRange.MAX),
        releaseCountry: getRandomElementInArray(MOVIE_COUNTRY),
      },
      runtime: getRandomIntInclusive(RunTime.MIN, RunTime.MAX),
      genre: Array.from(genre),
      description: Array.from(description).join(', '),
    },
    userDetails: {
      watchlist: Boolean(getRandomIntInclusive()),
      alreadyWatched: Boolean(getRandomIntInclusive()),
      watchingDate: creationDate(WatchingDateRange.MIN, WatchingDateRange.MAX),
      favorite: Boolean(getRandomIntInclusive()),
    },
  };
};

export const generateMocks = (comments, quantity) => {
  const arr = [];

  for (let i = 0; i < quantity; i++) {
    arr.push(generateMock(comments));
  }

  return arr;
};


import {SortStatsType} from '../const';
import SmartView from './smart';
import {getAmountOfWatchedMinutes, getCountHistoryFilms, getGenreHistoryFilms} from '../utils/stats';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {filterStats} from '../utils/filter';
import {getTimeFromMins} from '../utils/date';

const renderChart = (statisticCtx, films) => {
  const historyMovies = getGenreHistoryFilms(films, 'genres', 'counts');

  const BAR_HEIGHT = 50;

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * historyMovies.genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: historyMovies.genres,
      datasets: [{
        data: historyMovies.counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createFilterItemTemplate = (filter, currentFilterType) => {
  const labelText = String(filter[0].toUpperCase() + filter.slice(1)).replace('-', ' ');

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${filter === currentFilterType ? 'checked=true': ''}>
  <label for="statistic-${filter}" class="statistic__filters-label">${labelText}</label>`
  );
};

const createFilterTemplate = (currentFilterType) => {
  const filterItemsTemplate = Object.values(SortStatsType)
    .map((value) => createFilterItemTemplate(value, currentFilterType))
    .join('');

  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${filterItemsTemplate}
    </form>`
  );
};

const createStatisticsTemplate = (films, currentFilterType) => {
  const amountOfWatchedMinutes = getAmountOfWatchedMinutes(films);
  const historyMovies = getGenreHistoryFilms(films);

  const topGenre = historyMovies.genres[0];

  const userRating = document.querySelector('.profile__rating').textContent;

  const countHistoryMovies = getCountHistoryFilms(films);

  return (
    `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRating}</span>
  </p>
    ${createFilterTemplate(currentFilterType)}
  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${countHistoryMovies} <span class="statistic__item-description">films</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${getTimeFromMins(amountOfWatchedMinutes, true)}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
    </li>
  </ul>
  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>`);
};

export default class StatisticsView extends SmartView {
  #chart = null;
  #filterType = SortStatsType.ALL_TIME;

  constructor (films) {
    super();

    this._data = films;

    this.#setInnerHandlers();

    this.#setChart();
  }

  get template() {
    return createStatisticsTemplate(filterStats[this.#filterType](this._data), this.#filterType);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  #handleYearClick = () => {
    this.#filterType = SortStatsType.YEAR;
    this.updateElement();
  }

  #handleMonthClick = () => {
    this.#filterType = SortStatsType.MONTH;
    this.updateElement();
  }

  #handleWeekClick = () => {
    this.#filterType = SortStatsType.WEEK;
    this.updateElement();
  }

  #handleTodayClick = () => {
    this.#filterType = SortStatsType.TODAY;
    this.updateElement();
  }

  #handleClick = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'LABEL') {
      switch (evt.target.control.value) {
        case SortStatsType.YEAR:
          this.#handleYearClick();
          break;
        case SortStatsType.MONTH:
          this.#handleMonthClick();
          break;
        case SortStatsType.WEEK:
          this.#handleWeekClick();
          break;
        case SortStatsType.TODAY:
          this.#handleTodayClick();
          break;
        default:
          this.#filterType = SortStatsType.ALL_TIME;
          this.updateElement();
      }
    }
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.statistic__filters').addEventListener('click', this.#handleClick);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setChart();
  }

  #setChart = () => {
    const films = filterStats[this.#filterType](this._data);
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(statisticCtx, films);
  }
}

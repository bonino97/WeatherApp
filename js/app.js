const apiKey = '942efe42fad7cec9560614b927352b66';
const alertContainer = document.getElementById('alertContainer');

apiPerDay('New York'); //Initial Values

function getWeather(e) {
  e.preventDefault();
  const city = document.getElementById('city').value;
  apiPerDay(city);
}

function setDailyData(data) {
  document.getElementById('actualTemp').innerHTML = `${kelvinToCent(
    data.main.temp
  )}°`;
  document.getElementById('selectedCity').innerHTML = data.name;
  document.getElementById('weatherDescription').innerHTML =
    data.weather[0].description;
  document.getElementById('weatherMain').innerHTML = data.weather[0].main;
  document.getElementById('formattedDate').innerHTML = getDate(
    data.dt,
    data.timezone
  );
  document.getElementById('visibility').innerHTML = `${
    data.visibility / 1000
  } km`;
  document.getElementById('humidity').innerHTML = `${data.main.humidity} %`;
  document.getElementById('feelsLike').innerHTML = `${kelvinToCent(
    data.main.feels_like
  )}°`;
  document.getElementById('wind').innerHTML = `${data.wind.speed} m/s`;
  document.getElementById('sunrise').innerHTML = `${getHoursAndMinutes(
    data.sys.sunrise
  )} AM`;
  document.getElementById('sunset').innerHTML = `${getHoursAndMinutes(
    data.sys.sunset
  )} PM`;
  document.getElementById('tempMax').innerHTML = `${kelvinToCent(
    data.main.temp_max
  )}°`;
  document.getElementById('tempMin').innerHTML = `${kelvinToCent(
    data.main.temp_min
  )}°`;
}

function setWeeklyData(data) {
  if (data.length > 0) {
    document.getElementById('dayOne').innerHTML = getDayAndNumber(data[0].dt);
    document.getElementById('tempMaxDayOne').innerHTML = `${kelvinToCent(
      data[0].temp.max
    )}°`;
    document.getElementById('tempMinDayOne').innerHTML = `${kelvinToCent(
      data[0].temp.min
    )}°`;

    document.getElementById('dayTwo').innerHTML = getDayAndNumber(data[1].dt);
    document.getElementById('tempMaxDayTwo').innerHTML = `${kelvinToCent(
      data[1].temp.max
    )}°`;
    document.getElementById('tempMinDayTwo').innerHTML = `${kelvinToCent(
      data[1].temp.min
    )}°`;

    document.getElementById('dayThree').innerHTML = getDayAndNumber(data[2].dt);
    document.getElementById('tempMaxDayThree').innerHTML = `${kelvinToCent(
      data[2].temp.max
    )}°`;
    document.getElementById('tempMinDayThree').innerHTML = `${kelvinToCent(
      data[2].temp.min
    )}°`;

    document.getElementById('dayFour').innerHTML = getDayAndNumber(data[3].dt);
    document.getElementById('tempMaxDayFour').innerHTML = `${kelvinToCent(
      data[3].temp.max
    )}°`;
    document.getElementById('tempMinDayFour').innerHTML = `${kelvinToCent(
      data[3].temp.min
    )}°`;

    document.getElementById('dayFive').innerHTML = getDayAndNumber(data[4].dt);
    document.getElementById('tempMaxDayFive').innerHTML = `${kelvinToCent(
      data[4].temp.max
    )}°`;
    document.getElementById('tempMinDayFive').innerHTML = `${kelvinToCent(
      data[4].temp.min
    )}°`;

    document.getElementById('daySix').innerHTML = getDayAndNumber(data[5].dt);
    document.getElementById('tempMaxDaySix').innerHTML = `${kelvinToCent(
      data[5].temp.max
    )}°`;
    document.getElementById('tempMinDaySix').innerHTML = `${kelvinToCent(
      data[5].temp.min
    )}°`;

    document.getElementById('daySeven').innerHTML = getDayAndNumber(data[6].dt);
    document.getElementById('tempMaxDaySeven').innerHTML = `${kelvinToCent(
      data[6].temp.max
    )}°`;
    document.getElementById('tempMinDaySeven').innerHTML = `${kelvinToCent(
      data[6].temp.min
    )}°`;
  }
}

function apiPerDay(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      validateError(data.cod);
      apiPerWeek(data.coord.lat, data.coord.lon);
      setDailyData(data);
    });
}

function apiPerWeek(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      validateError(data.cod);
      setWeeklyData(data.daily);
    });
}

function showError(msg) {
  const alert = document.querySelector('.bg-red-100');

  if (!alert) {
    const alert = document.createElement('div');
    alert.classList.add('error-message');
    alert.innerHTML = `
          <span class="block">${msg}</span>
          `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function kelvinToCent(grade) {
  return parseInt(grade - 273.15);
}

function getDate(dateTimeStamp) {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let date = new Date(dateTimeStamp * 1000);
  let day = dayNames[date.getDay()];
  let dayNumber = date.getDate();
  let month = monthNames[date.getMonth()];
  let hours = date.getHours();
  let minutes = '0' + date.getMinutes();
  let formattedDate =
    day +
    ' ' +
    dayNumber +
    ', ' +
    month +
    ', ' +
    hours +
    ':' +
    minutes.substr(-2);

  return formattedDate;
}

function getHoursAndMinutes(dateTimeStamp) {
  let date = new Date(dateTimeStamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}

function getDayAndNumber(dateTimeStamp) {
  let date = new Date(dateTimeStamp * 1000);
  return date.toString().substr(0, 3) + ', ' + date.toString().substr(8, 2);
}

function validateError(cod) {
  if (cod === '404') {
    showError('City not found!');
    return;
  }
  if (cod === '400') {
    showError('An error ocurred, please search again!');
    return;
  }
}

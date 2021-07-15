const apiKey = '942efe42fad7cec9560614b927352b66';
const alertContainer = document.getElementById('alertContainer');

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
}

function apiPerDay(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      clearHTML();
      if (data.cod === '404') {
        showError('City not found!');
        return;
      }
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
      console.log(data.daily);
    });
}

function clearHTML() {
  return;
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

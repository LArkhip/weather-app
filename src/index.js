let globalCurrentTemperature = null;

// Display current Day&Time
let currentDayTime = document.querySelector("#currentDateTime");
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = "0" + hours;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = "0" + minutes;
}

currentDayTime.innerHTML = `${day} ${hours}:${minutes}`;

//display weather by Location
let locationWeatherBtn = document.querySelector("#currentLocationWeatherBtn");
locationWeatherBtn.addEventListener("click", getLocation);

function getLocation(event) {
  let inputCity = document.querySelector("#inputCity");
  inputCity.value = "";
  navigator.geolocation.getCurrentPosition(sendLocation);
}

function sendLocation(position) {
  let apiKey = "9cc1621f195afbca65aea792becaaa41";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeatherByLocation);
}

function showWeatherByLocation(response) {
  let windSpeed = document.querySelector("#windValue");
  windSpeed.innerHTML = `wind: ${response.data.wind.speed} m/sec`;

  let humidity = document.querySelector("#humidityValue");
  humidity.innerHTML = `humidity: ${response.data.main.humidity} %`;

  let weatherDescription = document.querySelector("#weatherDescription");
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;

  let currentLocation = document.querySelector("#currentCity");
  currentLocation.innerHTML = `${response.data.name}`;

  let locationCurrentTemp = document.querySelector("#currentTemperature");
  let currentTemp = Math.round(response.data.main.temp);

  globalCurrentTemperature = currentTemp;
  locationCurrentTemp.innerHTML = `${currentTemp}&deg;`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

// display weather by entered city
//Input-Search city
let inputCity = document.getElementById("inputCity");
inputCity.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
});

let searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", searchCity);

function searchCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#inputCity");
  if (inputCity.value) {
    let currentCity = document.querySelector("#currentCity");
    currentCity.innerHTML = `${inputCity.value}`;
    let apiKey = "9cc1621f195afbca65aea792becaaa41";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&units=metric`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  }
}

function getForecast(coordinates) {
  let apiKey = "9cc1621f195afbca65aea792becaaa41";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

// displaying current City Weather
function showTemperature(response) {
  let currentTemp = Math.round(response.data.main.temp);
  globalCurrentTemperature = currentTemp;
  let cityCurrentTemperature = document.querySelector("#currentTemperature");
  cityCurrentTemperature.innerHTML = `${currentTemp}&deg;`;

  let windSpeed = document.querySelector("#windValue");
  windSpeed.innerHTML = `wind: ${response.data.wind.speed} m/sec`;

  let humidity = document.querySelector("#humidityValue");
  humidity.innerHTML = `humidity: ${response.data.main.humidity} %`;

  let weatherDescription = document.querySelector("#weatherDescription");
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 8) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col">
            <div class="weekDay">${formatDay(forecastDay.dt)}</div>
            <img class="forecast-image" src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" />
            <div class="forecast-temperatures">
              <span class="forecast-max">${Math.round(
                forecastDay.temp.max
              )}&deg;</span>
              <span class="forecast-min">${Math.round(
                forecastDay.temp.min
              )}&deg;</span>
            </div>
          
      `;
      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;
    }
  });
}

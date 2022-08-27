let globalCurrentTemperature = null;
let globalForecast = null;    // just variable to store whatever we've got from API enriched with values in fahrenheit
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
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "9cc1621f195afbca65aea792becaaa41";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeatherByLocation);
}

function showWeatherByLocation(response) {
  let windSpeed = document.querySelector("#windValue");
  windSpeed.innerHTML = `${response.data.wind.speed} m/sec`;

  let humidity = document.querySelector("#humidityValue");
  humidity.innerHTML = `${response.data.main.humidity} %`;

  let weatherDescription = document.querySelector("#weatherDescription");
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;

  let currentLocation = document.querySelector("#currentCity");
  currentLocation.innerHTML = `${response.data.name}`;

  let locationCurrentTemp = document.querySelector("#currentTemperature");
  let currentTemp = Math.round(response.data.main.temp);

  globalCurrentTemperature = currentTemp;
  locationCurrentTemp.innerHTML = `${currentTemp}&deg;`;
  console.log(globalCurrentTemperature);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  document.getElementById("fahrenheit").style.color = "blue";
  document.getElementById("celcius").style.color = "black";

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

function celciusToFarenheit(c) {
  return (c * 9) / 5 + 32;
}

function storeForecast(apiResponse){ // little helper for mapping data from api response, adding values in fahrenheit
                                     //and storing result in global var
  let daily = apiResponse.data.daily;

  daily.forEach(d => {
    d.temp.minF = celciusToFarenheit(d.temp.min);
    d.temp.maxF = celciusToFarenheit(d.temp.max);
  });
  globalForecast = daily;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "9cc1621f195afbca65aea792becaaa41";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(response => { // instead of instantly calling displayForecast lets first store result in global var
    // and only then refresh UI
    storeForecast(response);
    displayForecast('c');
  });
}

// displaying current City Weather
function showTemperature(response) {
  let currentTemp = Math.round(response.data.main.temp);
  globalCurrentTemperature = currentTemp;
  let cityCurrentTemperature = document.querySelector("#currentTemperature");
  cityCurrentTemperature.innerHTML = `${currentTemp}&deg;`;

  let windSpeed = document.querySelector("#windValue");
  windSpeed.innerHTML = `${response.data.wind.speed} m/sec`;

  let humidity = document.querySelector("#humidityValue");
  humidity.innerHTML = `${response.data.main.humidity} %`;

  let weatherDescription = document.querySelector("#weatherDescription");
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);

  document.getElementById("fahrenheit").style.color = "blue";
  document.getElementById("celcius").style.color = "black";
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(unit) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  globalForecast.forEach(function (forecastDay, index) { //will use globalVar with data here instead of direct param
    if (index > 0 && index < 8) {
      //deciding c or f to show depending on unit param
      let min = unit == 'c' ? forecastDay.temp.min : forecastDay.temp.minF;
      let max = unit == 'c' ? forecastDay.temp.max : forecastDay.temp.maxF;
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
              max
          )}&deg;</span>
              <span class="forecast-min">${Math.round(
              min
          )}&deg;</span>
            </div>
          
      `;
      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;
    }
  });
}

// Switch between Celcius and Fahrenheit
let currentTemperature = document.querySelector("#currentTemperature");
let fahrenheit = document.querySelector("#fahrenheit");
let celcius = document.querySelector("#celcius");

function switchUnitsF(event) {
  if (globalCurrentTemperature != null) {
    let f = (globalCurrentTemperature * 9) / 5 + 32;
    currentTemperature.innerHTML = `${f}°`;
    document.getElementById("fahrenheit").style.color = "black";
    document.getElementById("celcius").style.color = "blue";
  }
  displayForecast('f'); //refresh html with data in fahrenheit
}
fahrenheit.addEventListener("click", switchUnitsF);

function switchUnitsC(event) {
  if (globalCurrentTemperature != null) {
    currentTemperature.innerHTML = `${globalCurrentTemperature}°`;
    document.getElementById("fahrenheit").style.color = "blue";
    document.getElementById("celcius").style.color = "black";
  }
  displayForecast('c'); //refresh html with data in celcius
}
celcius.addEventListener("click", switchUnitsC);

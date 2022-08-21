let globalCurrentTemperature = 0;

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
  console.log(response.data.name);
  console.log(response.data.main.temp);

  let currentLocation = document.querySelector("#currentCity");
  currentLocation.innerHTML = `${response.data.name}`;

  let locationCurrentTemp = document.querySelector("#currentTemperature");
  let currentTemp = Math.round(response.data.main.temp);
  locationCurrentTemp.innerHTML = `${currentTemp}&deg;`;
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

// displaying current City Weather
function showTemperature(response) {
  console.log(response.data);
  console.log(response.data.main.temp);
  console.log(response);
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
}

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

// Switch between Celcius and Fahrenheit
function switchUnitsF(event) {
  let fahrenheit = document.querySelector("#fahrenheit");
  let currentTemperature = document.querySelector("#currentTemperature");
  let f = (globalCurrentTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = `${f}°`;
  //fahrenheit.innerHTML = null;
}
fahrenheit.addEventListener("click", switchUnitsF);

function switchUnitsC(event) {
  let celcius = document.querySelector("#celcius");
  let currentTemperature = document.querySelector("#currentTemperature");
  currentTemperature.innerHTML = `${globalCurrentTemperature}°`;
  //celcius.innerHTML = null;
}
celcius.addEventListener("click", switchUnitsC);

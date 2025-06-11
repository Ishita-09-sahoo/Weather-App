const API_key = "af6c64540a18428e81c51422251006";
const baseUrl = "https://api.weatherapi.com/v1";

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const currLocButton = document.querySelector(".location");
const suggestionList = document.querySelector(".search-suggestions");

async function getSuggestions(city) {
  try {
    const response = await fetch(
      baseUrl + "/search.json" + `?key=${API_key}&q=${city}`
    );
    const suggestions = await response.json();
    console.log(suggestions);
    return suggestions;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getCurrentWeather(cityId) {
  try {
    const response = await fetch(
      baseUrl + "/forecast.json" + `?key=${API_key}&q=id:${cityId}`
    );
    const currentWeatherData = await response.json();
    console.log(currentWeatherData);
    return currentWeatherData;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getCurrentWeatherCoord(lat, lon) {
  try {
    const response = await fetch(
      baseUrl + "/forecast.json" + `?key=${API_key}&q=${lat},${lon}`
    );
    const currentWeatherData = await response.json();
    console.log(currentWeatherData);
    return currentWeatherData;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getWeeklyForecast(cityId) {
  try {
    const response = await fetch(
      baseUrl + "/forecast.json" + `?key=${API_key}&q=id:${cityId}&days=7`
    );
    const weeklyForecast = await response.json();
    console.log(weeklyForecast);
    return weeklyForecast;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getWeeklyForecastCoord(lat, lon) {
  try {
    const response = await fetch(
      baseUrl + "/forecast.json" + `?key=${API_key}&q=${lat},${lon}&days=7`
    );
    const weeklyForecast = await response.json();
    console.log(weeklyForecast);
    return weeklyForecast;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function convertTo12Hour(input) {
  let [hour, minute] = input.split(":").map(Number);
  const postfix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  return `${hour}:${minute.toString().padStart(2, "0")} ${postfix}`;
}

function setBox_1(currentWeatherData) {
  const loc = document.querySelector(".loc");
  const time = document.querySelector(".time");
  const date = document.querySelector(".date");

  loc.innerText = currentWeatherData.location.name;
  let time_24 = currentWeatherData.location.localtime.slice(-5);
  time.innerText = convertTo12Hour(time_24);
  date.innerText = currentWeatherData.location.localtime
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-");
}

function setBox_2(currentWeatherData) {
  const temp = document.querySelector(".temp");
  const feelsLike = document.querySelector(".feels-like");
  const maxMinTemp = document.querySelector(".maxmin-temp");
  temp.innerHTML = `${currentWeatherData.current.temp_c}&deg;C`;
  feelsLike.innerHTML = `Feels like: ${currentWeatherData.current.feelslike_c}&deg;C`;
  let maxTemp = currentWeatherData.forecast.forecastday[0].day.maxtemp_c;
  let minTemp = currentWeatherData.forecast.forecastday[0].day.mintemp_c;
  maxMinTemp.innerHTML = `${maxTemp}&deg;C/${minTemp}&deg;C`;

  const weatherIcon = document.querySelector(".icon-weather img");
  const weatherText = document.querySelector(".weather");
  weatherIcon.src = currentWeatherData.current.condition.icon;
  weatherText.innerText = currentWeatherData.current.condition.text;

  const sunrise = document.querySelector(".sunrise-text");
  const sunset = document.querySelector(".sunset-text");
  sunrise.innerHTML = `Sunrise <br> ${currentWeatherData.forecast.forecastday[0].astro.sunrise}`;
  sunset.innerHTML = `Sunset <br> ${currentWeatherData.forecast.forecastday[0].astro.sunset}`;
}

function setBox_3(weeklyForecast) {
  const days = document.querySelectorAll(".day");
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const img = day.querySelector(".image img");
    const tempRange = day.querySelector(".temp-range");
    const date = day.querySelector(".day-date");
    date.innerText = weeklyForecast.forecast.forecastday[i].date
      .slice(-5)
      .split("-")
      .reverse()
      .join("/");
    let minTemp = weeklyForecast.forecast.forecastday[i].day.mintemp_c;
    let maxTemp = weeklyForecast.forecast.forecastday[i].day.maxtemp_c;
    tempRange.innerHTML = `${maxTemp}&deg;C/${minTemp}&deg;C`;
    img.src = weeklyForecast.forecast.forecastday[i].day.condition.icon;
  }
}

function setBox_4(currentWeatherData) {
  const hours = document.querySelectorAll(".hour");
  for (let i = 0; i < hours.length; i++) {
    const hour = hours[i];
    const time = hour.querySelector(".hour-time");
    const temp = hour.querySelector(".hour-temp");
    const wind = hour.querySelector(".hour-wind");
    const rain = hour.querySelector(".hour-rain");
    let hourData = currentWeatherData.forecast.forecastday[0].hour[2 * i];
    time_24 = hourData.time.slice(-5);
    time.innerText = convertTo12Hour(time_24);
    temp.innerHTML = `<img src="${hourData.condition.icon}" alt="${hourData.condition.text}"> <br> ${hourData.temp_c}&deg;C`;
    wind.innerText = hourData.wind_kph + "km/h";
    rain.innerText = hourData.humidity + "%";
  }
}

function setBox_5(currentWeatherData) {
  const moonrise = document.querySelector(".moonrise");
  const moonset = document.querySelector(".moonset");
  const moonphase = document.querySelector(".moonphase-text");
  const moonphaseImg = document.querySelector(".moonphase-img img");
  let moonriseTime = currentWeatherData.forecast.forecastday[0].astro.moonrise;
  let moonsetTime = currentWeatherData.forecast.forecastday[0].astro.moonset;
  moonrise.innerHTML = `Moonrise <br> ${moonriseTime}`;
  moonset.innerHTML = `Moonset <br> ${moonsetTime}`;
  moonphase.innerText = currentWeatherData.forecast.forecastday[0].astro.moon_phase;
  moonphaseImg.src = `Assets/Images/${currentWeatherData.forecast.forecastday[0].astro.moon_phase}.svg`
}

function setBox_6(currentWeatherData) {
  const humidityText = document.querySelector(".humidity .card-text");
  const windSpeedText = document.querySelector(".wind-speed .card-text");
  const pressureText = document.querySelector(".pressure .card-text");
  const uvText = document.querySelector(".uv .card-text");
  const pptText = document.querySelector(".ppt .card-text");
  const visibilityText = document.querySelector(".visibility .card-text");

  const extraDetails = currentWeatherData.current;
  humidityText.innerText = extraDetails.humidity + '%';
  windSpeedText.innerText = extraDetails.wind_kph + 'km/h';
  pressureText.innerText = extraDetails.pressure_mb + 'mb';
  uvText.innerText = extraDetails.uv;
  pptText.innerText = extraDetails.precip_mm + 'mm';
  visibilityText.innerText = extraDetails.vis_km + 'km';
}

function setWeather(currentWeatherData, weeklyForecast) {
  setBox_1(currentWeatherData);
  setBox_2(currentWeatherData);
  setBox_3(weeklyForecast);
  setBox_4(currentWeatherData);
  setBox_5(currentWeatherData);
  setBox_6(currentWeatherData);
}

async function fetchSuggestionList() {
  const inputValue = searchInput.value;
  const suggestions = await getSuggestions(inputValue);
  suggestionList.innerHTML = "";
  suggestionList.style.display = "block";
  if (suggestions.length === 0) {
    suggestionList.innerText = "No result found";
  } else {
    suggestions.forEach((suggestion) => {
      const div = document.createElement("div");
      div.innerText = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
      suggestionList.appendChild(div);
      div.addEventListener("click", async () => {
        const currentWeatherData = await getCurrentWeather(suggestion.id);
        const weeklyForecast = await getWeeklyForecast(suggestion.id);
        setWeather(currentWeatherData, weeklyForecast);
        suggestionList.style.display = "none";
        suggestionList.innerHTML = "";
        searchInput.value = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
      });
    });
  }
}

//get the current location
function getCurrCoordinates() {
  let promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve({ lat, lon });
      },
      (error) => {
        reject(error.message);
      }
    );
  });
  return promise;
}

searchButton.addEventListener("click", () => {
  fetchSuggestionList();
});
searchInput.addEventListener("keydown", () => {
  fetchSuggestionList();
});

currLocButton.addEventListener("click", () => {
  getCurrCoordinates()
    .then(async ({ lat, lon }) => {
      const currentWeatherData = await getCurrentWeatherCoord(lat, lon);
      const weeklyForecast = await getWeeklyForecastCoord(lat, lon);
      setWeather(currentWeatherData, weeklyForecast);
    })
    .catch((error) => {
      console.log(error.message);
    });
  suggestionList.style.display = "none";
  suggestionList.innerHTML = "";
  searchInput.value = "";
});

getCurrCoordinates()
  .then(async ({ lat, lon }) => {
    const currentWeatherData = await getCurrentWeatherCoord(lat, lon);
    const weeklyForecast = await getWeeklyForecastCoord(lat, lon);
    setWeather(currentWeatherData, weeklyForecast);
  })
  .catch((error) => {
    console.log(error.message);
  });

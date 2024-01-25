const rootRef = document.getElementById("root");
const weatherRef = document.getElementById("weather");
const sunRef = document.getElementById("sun");
const tempRef = document.getElementById("temp");
const searchRef = document.getElementById("search");
const searchBtnRef = document.getElementById("searchbtn");

const geolocationRef = document.getElementById("geolocation");

import { getLocation } from "./geolocation.js";

searchBtnRef.addEventListener("click", (e) => {
  const value = searchRef.value;
  getLocationWeather(value);
});
async function getLocationWeather(value) {
  try {
    const getCityLocation = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=**f3dd140967385594d6c2566ef6d28eec`
    );

    const { lat, lon } = getCityLocation.data[0];

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=**f3dd140967385594d6c2566ef6d28eec&units=metric`
    );
    if (getCityLocation.data.length < 1) {
      return;
    }

    const { name, weather, main, sys } = weatherRes.data;
    if (weather.length < 1) {
      return;
    }

    const weatherObj = weather[0];

    updateInterface(weatherObj, name, weather, main, sys, weatherRes);
  } catch (err) {
    rootRef.innerHTML = "";
    weatherRef.innerHTML = "";
    tempRef.innerHTML = "";
    sunRef.innerHTML = "";
  }
}

geolocationRef.addEventListener("click", (e) => {
  async function getForecastData(latitude, longitude) {
    try {
      const data = await getLocation();

      const { latitude, longitude } = data.coords;
      const cityLocationRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=**f3dd140967385594d6c2566ef6d28eec&units=metric`
      );
      if (cityLocationRes.data.length < 1) {
        return;
      }

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=**f3dd140967385594d6c2566ef6d28eec&units=metric`
      );

      const { name, weather, main, sys } = weatherRes.data;
      if (weather.length < 1) {
        return;
      }

      const weatherObj = weather[0];
      updateInterface(weatherObj, name, weather, main, sys, weatherRes);
    } catch (err) {
      rootRef.innerHTML = `API Down`;
    }
  }

  getForecastData();
});

function updateInterface(weatherObj, name, weather, main, sys, weatherRes) {
  const { main: weatherMain } = weatherObj;
  const { temp, temp_min, temp_max, humidity, feels_like } = main;
  const { sunrise, sunset } = sys;
  const realTime = new Date(sunrise * 1000);
  const realTime2 = new Date(sunset * 1000);

  rootRef.innerHTML = `<h1> ${name}</h1>`;

  weatherRef.innerHTML = `<p>${Math.floor(temp)}°C</p>
                        <p>${weatherMain}</p>
                       <img src="http://openweathermap.org/img/wn/${
                         weatherRes.data.weather[0].icon
                       }@2x.png" />`;

  tempRef.innerHTML = `
                        <p> Min: ${Math.floor(temp_min)}°C Max: ${Math.floor(
    temp_max
  )}°C</p>
                         
                         <p> Feels Like: ${Math.floor(
                           feels_like
                         )}°C Humidity: ${humidity}% </p>
                         `;

  sunRef.innerHTML = `<p>Sunrise: ${realTime.toLocaleTimeString()} Sunsets: ${realTime2.toLocaleTimeString()}</p>
                         `;
}

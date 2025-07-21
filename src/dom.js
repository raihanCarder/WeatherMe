import { errorMsg } from "./state";

export default function createDomManager() {
  let currentMode = "Farenheit";

  function updateDom(data) {
    _todayData(data, currentMode);
    _weeklyForecastDom(data, currentMode);
  }

  function initDom(submitFunc) {
    const form = document.getElementById("form");
    const searchInput = document.getElementById("search-box");

    searchInput.addEventListener("input", () => errorMsg.hideErrorMsg());

    form.addEventListener("submit", (e) => getLocation(e));

    function getLocation(e) {
      e.preventDefault();

      if (!searchInput.checkValidity()) {
        errorMsg.displayError("Location Not Found", 4000);
        return;
      }

      submitFunc(searchInput.value);
      form.reset();
    }
  }

  function _todayData(data, mode = "Farenheit") {
    const todayDegrees = document.getElementById("today-degrees");
    const todayDesc = document.getElementById("today-description");
    const todayHigh = document.getElementById("today-high");
    const todayLow = document.getElementById("today-low");
    const locationName = document.getElementById("today-location-name");
    const body = document.getElementById("body");

    const dayData = data.days[0];

    if (mode === "Celcius") {
      //celciusConverter = ...
    }

    const temp = dayData.temp;
    const minTemp = dayData.tempmin;
    const maxTemp = dayData.tempmax;
    const sunrise = dayData.sunrise;
    const sunset = dayData.sunset;
    const conditions = dayData.conditions;
    let currTime = data.currentConditions.datetime;

    if (_isNight(currTime, sunrise, sunset)) {
      body.classList.add("night-mode");
      body.classList.remove("sunny-mode");
      body.classList.remove("cloudy-mode");
    } else if (conditions === "Clear") {
      body.classList.add("sunny-mode");
      body.classList.remove("night-mode");
      body.classList.remove("cloudy-mode");
    } else {
      body.classList.add("cloudy-mode");
      body.classList.remove("night-mode");
      body.classList.remove("sunny-mode");
    }

    const str = data.resolvedAddress;
    const index = str.indexOf(",");
    const firstPart = index !== -1 ? str.slice(0, index) : str;

    locationName.textContent = firstPart;
    todayDegrees.textContent = `${temp}°`;
    todayDesc.textContent = conditions;
    todayHigh.textContent = `H: ${maxTemp}°`;
    todayLow.textContent = `L: ${minTemp}°`;

    function _isNight(hourTime, sunrise, sunset) {
      const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const current = toMinutes(hourTime);
      const sunUp = toMinutes(sunrise);
      const sunDown = toMinutes(sunset);

      return current < sunUp || current > sunDown;
    }
  }

  function _weeklyForecastDom(data, mode) {
    const content = document.getElementById("forecast-content");
    content.textContent = "";

    const specData = data.days;

    for (let i = 1; i < 8; i++) {
      console.log(specData[i]);
      _createDayForecast(specData[i], content);
    }

    const lastItem = content.lastElementChild;
    lastItem.style.borderRight = "none";
  }

  function _createDayForecast(data, content) {
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("forecast-item");

    const date = document.createElement("p");
    date.textContent = data.datetime;

    const temp = document.createElement("p");
    temp.textContent = `${data.temp}°`;
    temp.classList.add("item-temp");

    const img = document.createElement("img");
    img.classList.add("icon");

    const iconName = data.icon;
    const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${iconName}.png`;
    img.src = iconUrl;
    img.alt = iconName;

    tempDiv.appendChild(date);
    tempDiv.appendChild(img);
    tempDiv.appendChild(temp);
    content.appendChild(tempDiv);
  }

  return { initDom, updateDom };
}

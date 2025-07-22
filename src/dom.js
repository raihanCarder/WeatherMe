import { errorMsg } from "./state";
import { formatInTimeZone } from "date-fns-tz";

export default function createDomManager() {
  let currentMode = "Fahrenheit";
  let currentData = "";

  function updateDom(data) {
    currentData = data;
    _todayData(data);
    _weeklyForecastDom(data);
    _todayExtraInfo(data);
  }

  function initDom(submitFunc) {
    const form = document.getElementById("form");
    const searchInput = document.getElementById("search-box");
    const celsiusBtn = document.getElementById("celsius-btn");
    const fahrenheitBtn = document.getElementById("fahrenheit-btn");

    searchInput.addEventListener("input", () => errorMsg.hideErrorMsg());

    form.addEventListener("submit", (e) => getLocation(e));

    celsiusBtn.addEventListener("click", () => {
      currentMode = "Celsius";
      fahrenheitBtn.classList.remove("selected");
      celsiusBtn.classList.add("selected");
      updateDom(currentData);
    });

    fahrenheitBtn.addEventListener("click", () => {
      currentMode = "Fahrenheit";
      fahrenheitBtn.classList.add("selected");
      celsiusBtn.classList.remove("selected");
      updateDom(currentData);
    });

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

  function _todayData(data) {
    const todayDegrees = document.getElementById("today-degrees");
    const todayDesc = document.getElementById("today-description");
    const todayHigh = document.getElementById("today-high");
    const todayLow = document.getElementById("today-low");
    const locationName = document.getElementById("today-location-name");
    const body = document.getElementById("body");

    const dayData = data.days[0];

    let temp, minTemp, maxTemp;

    if (currentMode === "Fahrenheit") {
      temp = dayData.temp;
      minTemp = dayData.tempmin;
      maxTemp = dayData.tempmax;
    } else {
      temp = _computeCelsius(dayData.temp);
      minTemp = _computeCelsius(dayData.tempmin);
      maxTemp = _computeCelsius(dayData.tempmax);
    }

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

  function _weeklyForecastDom(data) {
    const content = document.getElementById("forecast-content");
    content.textContent = "";

    const specData = data.days;

    for (let i = 1; i < 8; i++) {
      _createDayForecast(specData[i], content);
    }

    const lastItem = content.lastElementChild;
    lastItem.style.borderRight = "none";
  }

  function _createDayForecast(data, content) {
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("forecast-item");

    const date = document.createElement("p");
    date.classList.add("item-date");
    const dateText = new Date(`${data.datetime}T00:00:00`);
    const formatted = formatInTimeZone(dateText, data.timezone, "EEEE");
    date.textContent = formatted;

    const day = document.createElement("p");
    day.classList.add("item-day");
    day.textContent = formatInTimeZone(dateText, data.timezone, "MMMM do");

    const temp = document.createElement("p");
    const temperature =
      currentMode === "Fahrenheit"
        ? `${data.temp}°`
        : `${_computeCelsius(data.temp)}°`;
    temp.textContent = temperature;
    temp.classList.add("item-temp");

    const img = document.createElement("img");
    img.classList.add("icon");

    const iconName = data.icon;
    const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${iconName}.png`;
    img.src = iconUrl;
    img.alt = iconName;

    tempDiv.appendChild(date);
    tempDiv.appendChild(day);
    tempDiv.appendChild(img);
    tempDiv.appendChild(temp);
    content.appendChild(tempDiv);
  }

  function _todayExtraInfo(data) {
    const dayStat = document.getElementById("date-stat");
    const humidityStat = document.getElementById("humidity-stat");
    const windSpeedStat = document.getElementById("wind-speed-stat");
    const dewStat = document.getElementById("dew-stat");
    const cloudCoverage = document.getElementById("cloud-coverage-stat");
    const riskStat = document.getElementById("risk-stat");

    const currData = data.days[0];
    console.log(currData);

    const dateText = new Date(`${currData.datetime}T00:00:00`);
    const formatted = formatInTimeZone(
      dateText,
      data.timezone,
      "EEEE, MMMM do"
    );
    dayStat.textContent = formatted;

    humidityStat.textContent = `${currData.humidity}%`;
    windSpeedStat.textContent = `${currData.windspeed} mph`;
    dewStat.textContent = `${currentMode === "Fahrenheit" ? currData.dew : _computeCelsius(currData.dew)}°`;
    cloudCoverage.textContent = `${currData.cloudcover}%`;
    riskStat.textContent = `${currData.severerisk}%`;
  }

  function _computeCelsius(input) {
    return Math.round((input - 32) * (5 / 9) * 10) / 10;
  }

  return { initDom, updateDom };
}

import { errorMsg } from "./state";

export default function createDomManager() {
  let currentMode = "Farenheit";

  function updateDom(data) {
    _todayData(data, currentMode);
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

    let celciusConverter = 1;
    let diff = 0;
    if (mode === "Celcius") {
      //celciusConverter = ...
    }

    const temp = (dayData.temp - diff) * celciusConverter;
    const minTemp = (dayData.tempmin - diff) * celciusConverter;
    const maxTemp = (dayData.tempmax - diff) * celciusConverter;
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

  return { initDom, updateDom };
}

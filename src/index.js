import "./styles.css";
import { initState, errorMsg } from "./state";

// Yes, I know this API key is exposed. It's a free key from Visual Crossing and safe to use in this project.
// In production apps, API keys should be hidden using a backend or environment variables.
const apiKey = "58L99RYRJMCFEHC8MLZ5WEZUW";
const baseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

async function getLocationData(location) {
  try {
    const response = await fetch(`${baseUrl}${location}?key=${apiKey}`, {
      mode: "cors",
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching location data: ", error);
    return null;
  }
}

async function handleSearch(input) {
  const data = await getLocationData(input);

  if (data) {
    // update ui
  } else {
    errorMsg.displayError("Location Not Found");
  }
  console.log(data);
}

function initDom(submitFunc) {
  const form = document.getElementById("form");
  const searchInput = document.getElementById("search-box");

  searchInput.addEventListener("input", () => errorMsg.hideErrorMsg());

  form.addEventListener("submit", (e) => getLocation(e));

  function getLocation(e) {
    e.preventDefault();

    if (!searchInput.checkValidity()) {
      errorMsg.displayError("Location Not Found");
      return;
    }

    submitFunc(searchInput.value);
    form.reset();
  }
}

function initApp() {
  initState();
  initDom(handleSearch);
}

window.addEventListener("DOMContentLoaded", initApp);

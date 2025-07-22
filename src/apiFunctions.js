import { domManager, errorMsg } from "./state";

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
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

async function handleSearch(input) {
  const data = await getLocationData(input);
  if (data) {
    domManager.updateDom(data);
  } else {
    errorMsg.displayError("Location Not Found", 4000);
  }
}

export { handleSearch };

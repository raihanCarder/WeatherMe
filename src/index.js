import "./styles.css";
import { initState, domManager } from "./state";
import { handleSearch } from "./apiFunctions";

function initApp() {
  initState();
  domManager.initDom(handleSearch);
  handleSearch("Toronto"); // Load Toronto info by default
}

window.addEventListener("DOMContentLoaded", initApp);

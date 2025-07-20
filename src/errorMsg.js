export default function createErrorMsg() {
  const errorMsg = document.getElementById("error-msg");
  //   errorMsg.classList.add("invisible");

  function displayError(text) {
    errorMsg.textContent = text;
    errorMsg.classList.remove("invisible");
  }

  function hideErrorMsg() {
    errorMsg.classList.add("invisible");
  }

  return { displayError, hideErrorMsg };
}

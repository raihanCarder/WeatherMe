export default function createErrorMsg() {
  const errorMsg = document.getElementById("error-msg");
  let hiding = true;
  let timeoutId = null;

  errorMsg.classList.add("invisible");

  function displayError(text, timeout = null) {
    errorMsg.textContent = text;
    hiding = false;
    errorMsg.classList.remove("invisible");

    if (timeout) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (!hiding) {
          errorMsg.classList.add("invisible");
          hiding = true;
        }
      }, timeout);
    }
  }

  function hideErrorMsg() {
    clearTimeout(timeoutId);
    hiding = true;
    errorMsg.classList.add("invisible");
  }

  return { displayError, hideErrorMsg };
}

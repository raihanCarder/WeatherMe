import createErrorMsg from "./errorMsg";
import createDomManager from "./dom";

export let errorMsg = "";
export let domManager = "";

export function initState() {
  errorMsg = createErrorMsg();
  domManager = createDomManager();
  console.log("state init");
}

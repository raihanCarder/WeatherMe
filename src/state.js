import createErrorMsg from "./errorMsg";

export let errorMsg = "";

export function initState() {
  errorMsg = createErrorMsg();

  console.log("state init");
}

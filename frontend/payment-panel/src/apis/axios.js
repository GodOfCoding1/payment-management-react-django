import axios from "axios";
axios.defaults.withCredentials = true; // even for get requests if
// demand session authentication
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

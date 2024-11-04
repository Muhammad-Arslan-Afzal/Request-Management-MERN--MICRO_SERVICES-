import axios from "axios";

const authAPI = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL,
  withCredentials: true,
});

const notificationAPI = axios.create({
  baseURL: process.env.REACT_APP_NOTIFICATION_URL,
  withCredentials: true,
});

const requestAPI = axios.create({
  baseURL: process.env.REACT_APP_REQUEST_URL,
  withCredentials: true,
});

export { authAPI, notificationAPI, requestAPI };

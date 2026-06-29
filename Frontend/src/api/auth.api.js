import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL

const API = axios.create({
  baseURL: `${baseURL}/api`,
});

// LOGIN
export const loginUser = (data) => {
  return API.post("/users/login", data);
};

// SIGNUP
export const signupUser = (data) => {
  return API.post("/users/signup", data);
};

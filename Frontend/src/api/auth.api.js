import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// LOGIN
export const loginUser = (data) => {
  return API.post("/users/login", data);
};

// SIGNUP
export const signupUser = (data) => {
  return API.post("/users/signup", data);
};

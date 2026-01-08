import axios from "axios";

const API = axios.create({
  baseURL: "https://vedant-fast-api-todo-list.onrender.com/api",
});

export default API;

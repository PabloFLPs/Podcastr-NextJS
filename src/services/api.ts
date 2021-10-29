import axios from "axios"

export const api = axios.create({
  baseURL: "https://heroku-json-server.herokuapp.com/"
})
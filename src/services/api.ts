import axios from "axios"

export const api = axios.create({
  baseURL: "https://heroku-json-server.herokuapp.com/"
})

/**
 * Using "yarn server", you will run JSON-server with server.json file;
 * so the base URL needs to be that:
 * 
 * export const api = axios.create({
 *    baseURL: "http://localhost:3030/"
 * })
 */
import axios from "axios";

import { apiUrlCreator } from "../utility";


export const apiCall = (url, success, error) => {
  return axios
    .get(apiUrlCreator(url))
    .then(res => {
      if (success) {
        success(res.data);
      }
    })
    .catch(err => {
      if (error) {
        error(err);
      }
    });
}

export const apiPost = (url, data, success, error) => {
  return axios
    .post(apiUrlCreator(url), data)
    .then(res => {
      if (success) {
        success(res.data);
      }
    })
    .catch(err => {
      if (error) {
        error(err);
      }
    });
}

export const apiPut = (url, data, success, error) => {
  return axios
    .put(apiUrlCreator(url), data)
    .then(res => {
      if (success) {
        success(res.data);
      }
    })
    .catch(err => {
      if (error) {
        error(err);
      }
    });
}

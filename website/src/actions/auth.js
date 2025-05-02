import axios from "axios";
import * as actionTypes from "./actionTypes";
import { apiPost } from "./shared"
import { apiUrlCreator } from "../utility"

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

const login = (token, username, expirationDate, dispatch) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username)
  localStorage.setItem("expirationDate", expirationDate);
  axios.defaults.headers.common['Authorization'] = 'TOKEN ' + token;
  dispatch(authSuccess(token, username));
  dispatch(checkAuthTimeout(604800));
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("expirationDate");
  axios.defaults.headers.common['Authorization'] = null;
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const resetPassword = (email, success, error) => {
  axios
    .post(apiUrlCreator("/rest-auth/password/reset/"), {email: email})
    .then(res => {
      if (success) {
        success(res.data)
      }
    })
    .catch(err => {
      if (error) {
        error(err)
      }
    })
}

export const confirmPasswordReset = (uid, token, pass1, pass2, success, err) => {
  const payload = { uid: uid, token: token, new_password1: pass1, new_password2: pass2}
  const url = "/rest-auth/password/reset/confirm/"
  apiPost(url, payload, success, err)
}

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(apiUrlCreator("/rest-auth/login/"), {
        username: username,
        password: password
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 604800 * 1000);
        login(token, username, expirationDate, dispatch);
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(apiUrlCreator("/rest-auth/registration/"), {
        username: username,
        email: email,
        password1: password1,
        password2: password2
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 604800 * 1000);
        login(token, username, expirationDate, dispatch)
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        axios.defaults.headers.common['Authorization'] = 'TOKEN ' + token;
        dispatch(authSuccess(token, localStorage.getItem("username")));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

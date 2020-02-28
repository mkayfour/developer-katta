import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED
} from "./types";

import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// load user
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User action
export const register = ({ name, email, password }) => async dispatch => {
  console.log("register, called");

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    name,
    email,
    password
  });

  try {
    const res = await axios.post("/api/users", body, config);

    console.log(res.data);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

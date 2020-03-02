import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_CURRENT_PROFILE
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false
      };
    case AUTH_ERROR:
      //   localStorage.removeItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case LOGIN_FAIL:
      // localStorage.removeItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        repos: [],
        loading: false,
        profile: []
      };
    default:
      return state;
  }
}

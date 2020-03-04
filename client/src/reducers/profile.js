import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
}

import axios from "axios";
import { setAlert } from "./alert";

import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/api/post");

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.text }
    });
  }
};

// Add Like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.text }
    });
  }
};

// Remove Like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/post/unlike/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.text }
    });
  }
};

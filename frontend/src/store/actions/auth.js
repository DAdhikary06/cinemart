import axios from "../../axiosConfig";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../types/auth';

import { setUser, removeUser, isLoggedIn } from '../../utils/auth';

// Login user
export const login = (email, password) => async dispatch => {
  try {
    const response = await axios.post('/login', { email, password });
    console.log(response);
    const responseData = await response.data;
    console.log(responseData);
    if (response.status === 200) {
      const { user } = responseData;
      if (user) {
        setUser(user);
      }
      dispatch({ type: LOGIN_SUCCESS, payload: responseData, });
      // dispatch(setAlert(`Welcome ${user.name}`, "success", 5000));
    }

  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    // dispatch(setAlert(error.message, 'error', 5000));
    console.log('Login Failed: ', error);
  }
};

// Register user
export const register = ({ firstName, lastName, email, password, image }) => async (dispatch) => {
  try {
    const response = await axios.post('/register', {
      firstName,
      lastName,
      email,
      password,
    });
    const responseData = response.data;
    console.log(responseData);

    if (response.status === 201) {
      const { user } = responseData;
      if (user) {
        setUser(user);
      }
      dispatch({ type: REGISTER_SUCCESS, payload: responseData, });
      // dispatch(setAlert('Register Success', 'success', 5000));
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAIL });
    // dispatch(setAlert(error.message, 'error', 5000));
    console.log('Register Failed: ', error);
  }
};

// logout user

export const logout = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.post('/users/logout', { token });

    if (response.status === 200) {
      removeUser();
      dispatch({ type: LOGOUT });
      // dispatch(setAlert('Logout Success', 'success', 5000));
    }
  } catch (error) {
    // dispatch(setAlert(error.message, 'error', 5000));
    console.log('Logout Failed: ', error);
  }
};

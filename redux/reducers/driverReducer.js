
import { fetchDriversSuccess } from "../actions/driverActions";
import { FETCH_DRIVERS_SUCCESS } from '../actions/driverActions'

const initialState = {
  drivers: [],
};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DRIVERS_SUCCESS:
      return {
        ...state,
        drivers: action.payload,
      };
    default:
      return state;
  }
};

export default driverReducer;

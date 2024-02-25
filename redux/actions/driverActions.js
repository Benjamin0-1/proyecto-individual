
export const FETCH_DRIVERS_SUCCESS = 'FETCH_DRIVERS_SUCCESS';

export const fetchDriversSuccess = (drivers) => ({
  type: FETCH_DRIVERS_SUCCESS,
  payload: drivers,
});

// Add more actions for updating drivers if needed


export const FETCH_DRIVERS_SUCCESS = 'FETCH_DRIVERS_SUCCESS';

export const fetchDriversSuccess = (drivers) => ({
  type: FETCH_DRIVERS_SUCCESS,
  payload: drivers,
});

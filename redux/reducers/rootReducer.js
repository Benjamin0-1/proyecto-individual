
import { combineReducers } from 'redux';
import darkModeReducer from './darkModeReducer';
import driverReducer from './driverReducer';

const rootReducer = combineReducers({
    darkMode: darkModeReducer,
    drivers: driverReducer,
})

export default rootReducer;
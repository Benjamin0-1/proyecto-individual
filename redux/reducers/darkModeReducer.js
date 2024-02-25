//const initialState = false;

const initialState = {
    darkMode: false,
}

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      //return action.payload;
      return { ...state, darkMode: action.payload };
    default:
      return state;
  }
};

export default darkModeReducer;


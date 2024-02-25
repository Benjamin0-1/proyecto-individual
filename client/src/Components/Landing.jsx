
import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import './dark-mode.css';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../../redux/reducers/darkModeActions';
import Switch from 'react-switch';

//

//import DriverForm from './DriverForm';

import formula1Image from '/formula1.jpg'; //root: / : ./

const Landing = () => {
  const dispatch = useDispatch();
  //const darkMode = useSelector((state) => state.darkMode);
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };


  return (
    
    <div className={`landing-page ${darkMode ? 'dark-mode' : ''}`}>
      {<img src={formula1Image} alt="Formula 1" /> }
      <h1>Bienvenido a la Fórmula 1</h1>
      <Link to="/home">
        <button id='HomeButton'>Ir a Home</button>
      </Link>
      <Link to='/driverform'>
        <button id='HomeButton2'> Crear un conductor </button>
      </Link>
    {console.log('DARKMODE: ', darkMode)}
      <label>
        Dark Mode
        <Switch onChange={toggleDarkMode} checked={darkMode} />
      </label>
    {console.log('DARK MODE: ', darkMode)}
    </div>
  );
};

export default Landing;

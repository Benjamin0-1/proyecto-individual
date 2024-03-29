import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import { setDarkMode } from '../../../redux/reducers/darkModeActions';
import styles from './DriverForm.module.css';
import darkModeStyles from './dark-mode.module.css';

const DriverForm = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    description: '',
    image: '',
    nationality: '',
    birthDate: '',
    teams: [],
  });

  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    description: '',
    image: '',
    nationality: '',
    birthDate: '',
    teams: '',
  });

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    
    if (name === 'teams') {
      const teamIds = value.split(',').map((id) => id.trim());
      setFormData((prevData) => ({ ...prevData, [name]: teamIds }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  
  const handleImageValidation = () => {
   
    if (formData.image.trim() !== '') {
      const imageFormatRegex = /\.(jpg|jpeg|png|gif)$/i;
      if (!imageFormatRegex.test(formData.image)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: 'Error: Formato de imagen invalido. Usar una de las siguientes.jpg, .jpeg o png.',
        }));
        return false; 
      }
    }
    return true; 
  };
  
  

  const isValidName = (name) => {
    return name.length >= 3;
  };

  const isValidNationality = (nationality) => {
    return nationality.trim().length > 0;
  };

  const isValidBirthDate = (birthDate) => {
    const currentDate = new Date();
    const minimumBirthYear = currentDate.getFullYear() - 18;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return false;
    }
    const inputDate = new Date(birthDate);

    return inputDate.getFullYear() <= minimumBirthYear;
  };

  const isValidDescription = (description) => {
    return description.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //image
    const isImageValid = handleImageValidation();
    if (!isImageValid) {

      return;
    }

    if (!isValidName(formData.name)) {
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Error: Nombre debe tener al menos 3 caracteres' }));
      return;
    }

    if (!isValidName(formData.lastName)) {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: 'Error: Apellido debe tener al menos 3 caracteres' }));
      return;
    }

    if (!isValidNationality(formData.nationality)) {
      setErrors((prevErrors) => ({ ...prevErrors, nationality: 'Error: Debe incluir una nacionalidad' }));
      return;
    }

    if (!isValidBirthDate(formData.birthDate)) {
      setErrors((prevErrors) => ({ ...prevErrors, birthDate: 'Error: Fecha inválida: debe ser mayor de edad' }));
      return;
    }

    if (!isValidDescription(formData.description)) {
      setErrors((prevErrors) => ({ ...prevErrors, description: 'Error: Descripción demasiado corta' }));
      return;
    }

    setErrors({
      name: '',
      lastName: '',
      description: '',
      image: '',
      nationality: '',
      birthDate: '',
      teams: '',
    });

    try {
      const response = await fetch('http://localhost:3001/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Driver created successfully');
        setIsSuccess(true);
        setFormData({
          name: '',
          lastName: '',
          description: '',
          image: '',
          nationality: '',
          birthDate: '',
          teams: [],
        });
      } else {
        console.error('Failed to create driver:', response.statusText);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error creating driver:', error);
    }
  };

  return (
    <div className={`DriverForm ${darkMode ? 'dark-mode' : ''}`}>
      <form onSubmit={handleSubmit}>
        <h1>Crear un conductor</h1>

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        {errors.name && <div className="error-message" style={{ color: 'red' }}>{errors.name}</div>}

        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        {errors.lastName && <div className="error-message" style={{ color: 'red' }}>{errors.lastName}</div>}

        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} required />
        {errors.description && <div className="error-message" style={{ color: 'red' }}>{errors.description}</div>}

        <label htmlFor="image">Image URL:</label>
        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
        {errors.image && <div className="error-message" style={{ color: 'red' }}>{errors.image}</div>}

        <label htmlFor="nationality">Nationality:</label>
        <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} required />
        {errors.nationality && <div className="error-message" style={{ color: 'red' }}>{errors.nationality}</div>}

        <label htmlFor="birthDate">Birth Date:</label>
        <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        {errors.birthDate && <div className="error-message" style={{ color: 'red' }}>{errors.birthDate}</div>}

        <label htmlFor="teams">Teams:</label>
        <input type="text" id="teams" placeholder='Ingresar Id de Team' name="teams" value={formData.teams} onChange={handleChange} />
        {errors.teams && <div className="error-message" style={{ color: 'red' }}>{errors.teams}</div>}

        <label>
          Dark Mode
          <Switch onChange={toggleDarkMode} checked={darkMode} />
        </label>

        <button type="submit">Create Driver</button>

        {isSuccess !== null && (
          <h2 style={{ color: isSuccess ? 'green' : 'red' }}>
            {isSuccess ? 'Conductor creado con éxito' : 'Error creando conductor'}
          </h2>
        )}
      </form>
    </div>
  );
};

export default DriverForm;

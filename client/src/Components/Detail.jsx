import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// esta es la pagina de Detail
function DriverProfile() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/drivers/${id}`);
        const data = await response.json();
        setDriver(data);
      } catch (error) {
        console.error('Error buscando detalles de conductor:', error);
      }
    };
  
    fetchData();
  }, [id]);
  
  if (!driver) {
    return <p>No hay ningun conductor</p>;
  }

  return (
    <div className='Detail'>
      <h2>Driver Profile</h2>
      <p>ID: {driver.id}</p>
      <p>Nombre: {driver.name.forename}</p>
      <p>Apellido: {driver.name.surname}</p>
      <p>Descripcion: {driver.description}</p>
      {/* Check if driver.image is defined and has a url property */}
      {driver.image && typeof driver.image === 'object' && driver.image.url ? (
        <img src={driver.image.url} alt={driver.name.forename} />
      ) : (
        <img src="https://c8.alamy.com/comp/DNM9P1/a-vector-illustration-of-a-race-car-driver-in-front-of-his-car-DNM9P1.jpg" alt="Imagen por defecto" />
      )}
      <p>Fecha de nacimiento: {driver.birthDate}</p>
      <p>Escuderia: {driver.teams}</p>
    </div>
  );
  
  
}

export default DriverProfile;

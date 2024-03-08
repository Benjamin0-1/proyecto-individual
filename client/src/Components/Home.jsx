import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { setDarkMode } from '../../../redux/reducers/darkModeActions';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import './dark-mode.css';
import { fetchDriversSuccess } from '../../../redux/actions/driverActions';
import './Home.css';

import DatabaseSearchBar from './DatabaseSearch';

function Home() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [needsSorting, setNeedsSorting] = useState(false);
  const [isAlphabeticalOrder, setIsAlphabeticalOrder] = useState(false);
  const [alphabeticalOrder, setAlphabeticalOrder] = useState(false);
  const [inputTeam, setInputTeam] = useState('');

  const dispatch = useDispatch();
  //const darkMode = useSelector((state) => state.darkMode);
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const driversFromRedux = useSelector((state) => state.drivers.drivers);
  const [isReversedSorting, setIsReversedSorting] = useState(false);
  const [inputBirthDate, setInputBirthDate] = useState('');

  const [invalidDateFormatError, setInvalidDateFormatError] = useState(false);
  const [noDriverFoundError, setNoDriverFoundError] = useState(false);
  const [noDriverFoundByTeamError, setNoDriverFoundByTeamError] = useState(false);
  const [noDriverFoundByBirthDateError, setNoDriverFoundByBirthDateError] = useState(false);

  const [dbSearchTerm, setDbSearchTerm] = useState('');
  const [dbSearchResults, setDbSearchResults] = useState([]);

  const [dbDrivers, setDbDrivers] = useState([]);
  const [noDbDriverFoundError ,setNoDbDriverFoundError] = useState(false);
  const [structureEror, setStructureError] = useState(false);

  const driversPerPage = 9;
  const apiUrl = 'http://localhost:5000';

  /*
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl + '/drivers');
      const data = await response.json();
      
      let sortedData = [...data];
      sortedData.sort((a, b) => a.name.forename.localeCompare(b.name.forename));
      
      setDrivers(data);
      setFilteredDrivers(sortedData);
    } catch (error) {
      setError(error);
      console.log('Error trayendo conductores: ', error);
    }
  };
*/

//debug 
/*
const handleDatabaseSearch = async (searchTerm) => {
  try {
    const searchUrl = `http://localhost:3001/drivers/searchname/name?name=${searchTerm}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Database search results:', data);

    if (Array.isArray(data) && data.length > 0 && data.every((driver) => driver.name)) {
      setDbSearchResults(data);
      setNoDriverFoundError(false);
      setCurrentPage(1);
    } else {
      setDbSearchResults([]);
      setNoDriverFoundError(true);
    }
  } catch (error) {
    setError(error);
    console.log('Error searching for drivers in the database: ', error);
    setNoDriverFoundError(true);
  }
}; */







const fetchData = async () => {
  try {
    const apiResponse = await fetch(apiUrl + '/drivers');
    const apiData = await apiResponse.json();

    const databaseResponse = await fetch('http://localhost:3001/drivers');
    const databaseData = await databaseResponse.json();

    const combinedData = [...apiData, ...databaseData];

    dispatch(fetchDriversSuccess(combinedData));
  } catch (error) {
    setError(error);
    console.log('Error fetching drivers:', error);
  }
};



  const handleFilterByBirthDate = () => { // CREAR UNA PARA LOS DRIVERS DEL FORM.
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(inputBirthDate)) {
        setInvalidDateFormatError(true);
        setNoDriverFoundError(false);
        return;
      };    

      const trimmedInputBirthDate = inputBirthDate.trim();
    
      const filtered = drivers.filter((driver) => {
        try {
          const driverBirthDate = driver.dob;
    
          return (
            driverBirthDate ===
            (isNaN(Date.parse(driverBirthDate)) ? 'Invalid Date' : trimmedInputBirthDate)
          );
        } catch (error) {
          console.error('Error parsing date:', error);
          console.log('Driver:', driver);
          console.log('Trimmed Input Birth Date:', trimmedInputBirthDate);
          return false; 
        }
      });
    
      setFilteredDrivers(filtered);

      setInvalidDateFormatError(false);
      //setNoDriverFoundError(filtered.length === 0);
      setNoDriverFoundByBirthDateError(filtered.length === 0);
      setCurrentPage(1);

    };
       

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };
  

  const applySorting = () => {
    console.log('aplicando filtrado');
  
    let sorted = [...filteredDrivers];
  
    if (sortBy === 'name') {
      sorted.sort((a, b) => {
        const forenameA = a.name && a.name.forename ? a.name.forename : '';
        const forenameB = b.name && b.name.forename ? b.name.forename : '';
        return forenameA.localeCompare(forenameB);
      });
    } else if (sortBy === 'birthdate') {
      sorted.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
    }
  
    if (isAlphabeticalOrder) {

      sorted.reverse();
    } else {

      sorted.sort((a, b) => {
        const forenameA = a.name && a.name.forename ? a.name.forename : '';
        const forenameB = b.name && b.name.forename ? b.name.forename : '';
        return forenameA.localeCompare(forenameB);
      });
    }
  
    setFilteredDrivers(sorted);
    console.log(sorted);
    setNeedsSorting(false);
  };
  
  // mostrar desde el ultimo driver hasta el primero.
  const handleApplySortingReversed = () => {
    applySortingReversed(); 
    setIsReversedSorting((prev) => !prev); 
  };
  
  const applySortingReversed = () => {
    let sortedDrivers = [...drivers];
  
    if (isReversedSorting) {
     
      sortedDrivers.sort((a, b) => b.id - a.id);
    } else {
      sortedDrivers.sort((a, b) => a.id - b.id);
    }
  
    setFilteredDrivers(sortedDrivers);
    setNeedsSorting(false);
  };
    
  

  const handleButtonClick = () => {
    fetchData();

  };

  const handleDatabaseSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/drivers/searchname/name?name=${searchTerm}`);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0 && data.every((driver) => driver.name)) {
        setDbDrivers(data);
        //setNoDriverFoundError(false)
        setNoDbDriverFoundError(false)
      } else {
        setDbDrivers([]);
        console.log('No database drivers found');
        //setNoDriverFoundError(true) 
        setNoDbDriverFoundError(true)
       
      }
  
    } catch (error) {
      console.error('Error fetching database drivers:', error);

    }
  };
  

  const handleSearchBar = async (searchTerm) => {
    try {
      let searchUrl;
  
      if (selectedOrigin === 'API') {
        searchUrl = `${apiUrl}/drivers?name.forename=${searchTerm}`;
      } else if (selectedOrigin === 'Database') {
        searchUrl = `http://localhost:3001/drivers/searchname/name?name=${searchTerm}`;
        //handleDatabaseSearch(searchTerm) // not valid JSON
      }
  
      console.log('DB O API SELECCIONADA: ', searchUrl); // funciona la seleccion
  
      const response = await fetch(searchUrl);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0 && data.every((driver) => driver.name && driver.name.forename)) {
        console.log(data[0].name);
        setFilteredDrivers(data);
        setNoDriverFoundError(false); 
        setCurrentPage(1);
      } else {
        console.log('No hay conductores con ese nombre');
        setFilteredDrivers([]); 
        setNoDriverFoundError(true); // 
      }

    } catch (error) {
      setError(error);
      console.log('Error buscando conductores: ', error);
    }
  };
  

  const handleToggleAlphabeticalOrder = () => {
    setIsAlphabeticalOrder((prev) => !prev);
    setNeedsSorting(true);
    applySorting(); // aplicar
  };
  

  const applyFilters = () => {
    let filtered = drivers;

    if (selectedTeam) {
      filtered = filtered.filter((driver) => driver.teams && driver.teams.includes(selectedTeam));
    }

    if (inputTeam) {
      filtered = filtered.filter((driver) => driver.teams && driver.teams.includes(inputTeam));
    }

    if (selectedOrigin) {
      filtered = filtered.filter((driver) => driver.origin === selectedOrigin);
    }

    setFilteredDrivers(filtered);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleFilterByTeam = () => {
    const filtered = drivers.filter((driver) => {
      if (typeof driver.teams === 'string' && driver.teams.trim().length > 0) {
        const teamsArray = driver.teams.split(',').map((team) => team.trim());
        
        return teamsArray.some((team) => team.toLowerCase().includes(inputTeam.toLowerCase()));
      }
  
      return true;
    });
  
    //setNoDriverFoundByTeamError(filtered.length === 0 || (filtered.length === drivers.length && inputTeam.trim() !== ''));
    setNoDriverFoundByTeamError(filtered.every(driver => !driver.teams || driver.teams.length === 0));


    setFilteredDrivers(filtered);
    setCurrentPage(1); 
  };
  
  

  //useEffects 
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = 'http://localhost:5000/drivers';
      const dbUrl = 'http://localhost:3001/drivers';
  
      try {
        // Fetch data from the API
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
  
        // Fetch data from the database
        const dbResponse = await fetch(dbUrl);
        const dbData = await dbResponse.json();
        console.log('DB data: ', dbData);
  
        // Combine data from both sources
        const combinedData = [...apiData, ...dbData];
  
        if (combinedData.length > 0) {
          setDrivers(combinedData);
          setFilteredDrivers(combinedData);
        } else {
          console.error('No drivers found.');
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
  
    fetchData();
  }, [dispatch]);
  
  
  
  useEffect(() => {

    if (selectedTeam || inputTeam || selectedOrigin || inputBirthDate|| currentPage || drivers.length > 0) {
      applyFilters();
    }
  }, [selectedTeam, inputTeam, selectedOrigin, drivers, currentPage]); // filteredDrivers
  

  useEffect(() => {
    if (needsSorting) {
      applySorting();
    }
  }, [needsSorting, applySorting]);
  
  

  return (
    <div className={`Home ${darkMode ? 'dark-mode' : ''}`}>

      <SearchBar onSearch={handleSearchBar} 
      onToggleAlphabeticalOrder={handleToggleAlphabeticalOrder} />
      {noDriverFoundError && <p style={{ color: 'red' }}>No hay conductor con ese nombre</p>}
      <div>
        <button onClick={() => setSelectedOrigin('API')}>API</button>
        <button onClick={() => setSelectedOrigin('Database')}>Database (From API)</button>
      </div>

      
    
      <label>
        Dark Mode
        <Switch onChange={toggleDarkMode} checked={darkMode} />
      </label>
      <div>
    
    <DatabaseSearchBar onDatabaseSearch={handleDatabaseSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    
    
    {dbDrivers.length > 0 ? (
  dbDrivers.map((driver) => (
    <Link to={`/drivers/${driver.id}`} key={driver.id}>
      <div>
        <ul>
          <li>Nombre: {driver.name}</li>
          <li>Apellido: {driver.lastName}</li>
          <li>ID: {driver.id}</li>
        </ul>
      </div>
    </Link>
  ))
) : (
  
  noDbDriverFoundError ? (
    <p style={{ color: 'red' }}>No hay conductores en la base de datos con ese nombre</p>
  ) : null
)}

  </div>

      

      <div>
        <input
          type="text"
          placeholder="Filtrar por equipo"
          value={inputTeam}
          onChange={(e) => setInputTeam(e.target.value)}
        />
        <button onClick={handleFilterByTeam}>Aplicar filtrado por equipo</button>     
        {noDriverFoundByTeamError && <p style={{ color: 'red' }}>No hay conductores con ese equipo</p>}
      </div> { /*  create NEW STATE  so that both erros are not triggered at once  */ }

      <div>

      <input
        type="text"
        placeholder="Filtar por fecha de nacimiento (YYYY-MM-DD)"
        value={inputBirthDate}
        onChange={(e) => setInputBirthDate(e.target.value)}
      />
      <button onClick={handleFilterByBirthDate}>Aplicar filtrado por fecha de nacimiento</button>
      {invalidDateFormatError && <p style={{ color: 'red' }}>Formato de fecha invalido</p>}
      {noDriverFoundByBirthDateError && <p style={{ color: 'red' }}>No hay conductor con esa fecha de nacimiento</p>}

    </div>


    <div className="driver-cards">
      {filteredDrivers.name}
  {(filteredDrivers.length > 0 ? filteredDrivers : drivers)
    .slice((currentPage - 1) * driversPerPage, currentPage * driversPerPage)
    .map((driver) => (
      <Link to={`/drivers/${driver.id}`} key={driver.id}>
        <div className="driver-card">
          {driver.image && typeof driver.image === 'object' && driver.image.url && (
            <img src={driver.image.url} alt={driver.name.forename} />
          )}
          <p>
            <strong>Name:</strong> {driver.name.forename} {driver.name.surname}
            
          </p>
          <p>
            <strong>Teams:</strong> {Array.isArray(driver.teams) ? driver.teams.join(', ') : driver.teams}
          </p>
        </div>
      </Link>
    ))}
    
</div>




  
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Pagina Previa
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * driversPerPage >= (filteredDrivers.length > 0 ? filteredDrivers : drivers).length}
        >
          Siguiente Pagina
        </button>
      </div>

    </div>
  );
  
  

}

export default Home;

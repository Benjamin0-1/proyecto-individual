import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { setDarkMode } from '../../../redux/reducers/darkModeActions';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import './dark-mode.css';
import { fetchDriversSuccess } from '../../../redux/actions/driverActions';


// orden alfabetico al final.
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



  const fetchData = async() => {
    try {
      const response = await fetch(apiUrl + '/drivers');
      const data = await response.json();

      dispatch(fetchDriversSuccess(data));

    } catch (error) {
      setError(error);
      console.log('Error trayendo conductores: ', error);
     }};




  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };
  

  const applySorting = () => {
    console.log('Applying Sorting');
  
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
    applySortingReversed(); // Assuming applySortingReversed is your existing function for reversed sorting
    setIsReversedSorting((prev) => !prev); // Toggle the state
  };
  
  const applySortingReversed = () => {
    let sortedDrivers = [...drivers];
  
    if (isReversedSorting) {
      // Apply reversed sorting
      sortedDrivers.sort((a, b) => b.id - a.id);
    } else {
      // Apply original sorting
      sortedDrivers.sort((a, b) => a.id - b.id);
    }
  
    setFilteredDrivers(sortedDrivers);
    setNeedsSorting(false);
  };
  
  
  
  

  const handleButtonClick = () => {
    fetchData();
  };

  const handleSearchBar = async (searchTerm) => {
    try {
      let searchUrl;

      if (selectedOrigin === 'API') {
        searchUrl = `${apiUrl}/drivers?name.forename=${searchTerm}`;
      } else if (selectedOrigin === 'Database') {
        searchUrl = `http://localhost:3001/drivers/searchname/name?name=${searchTerm}`;
      }

      console.log('DB O API SELECCIONADA: ', searchUrl);

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data.every((driver) => driver.name && driver.name.forename)) {
        console.log(data[0].name);
        setFilteredDrivers(data);
      } else {
        console.log('No hay conductores con ese nombre');
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
      // Check if driver.teams is a string and not an empty string
      if (typeof driver.teams === 'string' && driver.teams.trim().length > 0) {
        const teamsArray = driver.teams.split(',').map((team) => team.trim());
        
        return teamsArray.some((team) => team.toLowerCase().includes(inputTeam.toLowerCase()));
      }
      
   
      return true;
    });
  
    setFilteredDrivers(filtered); 
  };  
  //useEffects 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/drivers');
        const data = await response.json();
  
        // Ensure the data is an array and not empty
        if (Array.isArray(data) && data.length > 0) {
          setDrivers(data);
          setFilteredDrivers(data);
        } else {
          console.error('No drivers found.');
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
  
    fetchData();

  }, []); 
  
  
  useEffect(() => {

    if (selectedTeam || inputTeam || selectedOrigin || currentPage || drivers.length > 0) {
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

      <SearchBar onSearch={handleSearchBar} onToggleAlphabeticalOrder={handleToggleAlphabeticalOrder} />
      <label>
        Dark Mode
        <Switch onChange={toggleDarkMode} checked={darkMode} />
      </label>
      
      <div>
      <button onClick={handleApplySortingReversed}>
      {isReversedSorting ? "Ordenar al reves" : "Orden original"}
      </button>

    </div>

      <div>
        {/*<button onClick={() => setSortBy('name')}>Sort by Name</button>*/}
        {/*<button onClick={() => setSortBy('birthdate')}>Sort by Birthdate</button>*/}
      </div>

      <div>
        <button onClick={() => setSelectedOrigin('API')}>API</button>
        <button onClick={() => setSelectedOrigin('Database')}>Database</button>
      </div>


      <div>
        <input
          type="text"
          placeholder="Filter By Team"
          value={inputTeam}
          onChange={(e) => setInputTeam(e.target.value)}
        />
        <button onClick={handleFilterByTeam}>Aplicar filtrado por equipo</button>     
      </div>

      <div className="driver-cards">
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

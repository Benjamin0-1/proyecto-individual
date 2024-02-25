import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Components/Home';
import Landing from './components/landing';
import SearchBar from './Components/SearchBar';
import Detail from './Components/Detail';
import DriverForm from './Components/DriverForm';
//redux
import { Provider } from 'react-redux';
import store from '../../redux/store/configureStore';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/drivers/:id" element={<Detail />} />
          <Route path="/driverform" element={<DriverForm />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </Provider>
  );
};

 


export default App;

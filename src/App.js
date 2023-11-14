import {Route,Routes } from 'react-router-dom';
import Body from './FrontEnd/Body/Body';
import Footer from './FrontEnd/Footer/Footer';
import Header from './FrontEnd/Header/Header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Body />}></Route>
      </Routes>
      <Footer/>
    </>
  )
}

export default App;

import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Browse from './pages/register/Register';
import CreateObject from './pages/CreateObject';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/register/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/createObject" element={<CreateObject/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Browse from './pages/objects/Browse';
import CreateObject from './pages/objects/CreateObject';
import ObjectDetails from './pages/objects/ObjectDetails';
import Profile from './pages/Profile';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/register/Register';
import Navbar from './components/Navbar';
import Users from './pages/Users/Users';

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/createObject" element={<CreateObject/>} />
        <Route path="/objects/:id" element={<ObjectDetails/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
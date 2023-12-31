import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login";
import CreateBooking from "./components/BookCar/CreateBooking";
import UpdateBooking from "./components/BookCar/UpdateBooking";
import ForgotPassword from './components/Auth/ForgotPassword';
import Error404 from "./components/Error404";
import AllCars from './components/AllCars';
import Hero from './components/Hero'
import Navbar from './components/Navbar';
import { Auth, AuthGuard } from "./components/Auth";

window.react_app_url = "http://localhost:3000/"

const App = () => {
  const location = useLocation();
  const dontShowNavbarPaths = ["/login","/forgot-password"];
  const shouldShowNavbar = dontShowNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldShowNavbar && <Navbar />}
      <Routes>
        <Route index element={<Auth element={<Hero />} />} />
        <Route path="login" element={<AuthGuard element={<Login />} />} />
        <Route path="forgot-password" element={<AuthGuard element={<ForgotPassword />} />} />
        <Route path="update-booking/:id" element={<Auth element={<UpdateBooking />} />} />
        <Route path="add-booking" element={<Auth element={<CreateBooking />} />} />
        <Route path="all-cars" element={<Auth element={<AllCars />} />} />
        <Route path="*" element={<Auth element={<Error404 />} />} />
      </Routes>
    </>
  );
};

export default App;

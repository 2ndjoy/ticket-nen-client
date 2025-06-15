import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Log_in from "./components/Log_in";
import AboutUs from "./components/AboutUs";
import Register from "./components/Register";
import Footer from "./components/Footer";
import ManageEvents from "./components/admin/ManageEvents";
import Admin from "./components/admin/Admin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import ManageOrganizer from "./components/admin/ManageOrganizer";


function Routers() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Log_in/>} />
        <Route path="/register" element={<Register/>} />
        
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/manage-events" element={<ManageEvents/>} />
        <Route path="/admin/manage-users" element={<ManageUsers/>} />
        <Route path="/admin/manage-organizers" element={<ManageOrganizer/>} />

      </Routes>
      <Footer />
    </>
  );
}

export default Routers;

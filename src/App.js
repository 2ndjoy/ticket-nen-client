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
import OrganizerDashboard from "./components/organizer/OrganizerDashboard";
import AddEventPage from "./components/organizer/AddEventPage";
import MyEvents from "./components/organizer/MyEvents";
import OrganizerPerformance from "./components/organizer/OrganizerPerformance";
import OrganizerProfile from "./components/organizer/OrganizerProfile";
import EditOrganizerProfile from "./components/organizer/EditOrganizerProfile";
import TicketsSold from "./components/admin/TicketsSold";
import Charts from "./components/admin/Charts";
import AdminLayout from "./components/admin/AdminLayout";
import OrganizerLayout from "./components/organizer/OrganizerLayout";
import PromoteEvent from "./components/PromoteEvent";


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
        <Route path="/promoteevent" element={<PromoteEvent/>} />
        
       {/* Admin Routes with Sidebar Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> {/* Default: /admin */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-organizers" element={<ManageOrganizer />} />
          <Route path="tickets-sold" element={<TicketsSold />} />
          <Route path="charts" element={<Charts />} />
        </Route>


      <Route path="/organizer" element={<OrganizerLayout />}>
      <Route index element={<OrganizerDashboard />} /> 
  <Route path="organizer-dashboard" element={<OrganizerDashboard />} />
  <Route path="add-event" element={<AddEventPage />} />
  <Route path="my-events" element={<MyEvents />} />
  <Route path="performance" element={<OrganizerPerformance />} />
  <Route path="profile" element={<OrganizerProfile />} />
  <Route path="edit-profile" element={<EditOrganizerProfile />} />
</Route>


      </Routes>
      <Footer />
    </>
  );
}

export default Routers;

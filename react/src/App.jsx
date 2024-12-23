import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from './Components/Login/login';
import Dashboard from "./Components/Dashboard/Dashboard";
import Students from "./Components/Students/Students";
import AddStudent from "./Components/Students/AddStudent";
import EditStudent from "./Components/Students/EditStudent";
import Billing from "./Components/Billing/Billing";
import Providers from "./Components/Providers/Providers";
import School from "./Components/School/School";
import Calendar from "./Components/Calendar/Calendar";
import Holidays from "./Components/Holidays/Holidays";
import AddHoliday from "./Components/Holidays/AddHoliday";
import AddProviders from "./Components/Providers/AddProviders";
import EditProviders from "./Components/Providers/EditProviders";
import AddSchool from "./Components/School/AddSchool";
import AssignProviders from "./Components/Students/AssignProviders";
// import Students from "./Components/School/AddSchool";
import 'react-big-calendar/lib/css/react-big-calendar.css';


// Higher-Order Component to wrap routes with Navbar
const WithNavbar = ({ component: Component }) => (
  <>
    <Navbar />
    <Component />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route path="/" element={<Login />} />
      
        {/* Routes for pages that include Navbar */}
        <Route path="/Dashboard" element={<WithNavbar component={Dashboard} />} />
        <Route path="/Students" element={<WithNavbar component={Students} />} />
        <Route path="/Billing" element={<WithNavbar component={Billing} />} />
        <Route path="/Providers" element={<WithNavbar component={Providers} />} />
        <Route path="/School" element={<WithNavbar component={School} />} />
        <Route path="/Holidays" element={<WithNavbar component={Holidays} />} />
        <Route path="/AddHoliday" element={<WithNavbar component={AddHoliday} />} />
        <Route path="/Calendar" element={<WithNavbar component={Calendar} />} />
        <Route path="/AddProviders" element={<WithNavbar component={AddProviders} />} />
        <Route path="/EditProviders/:ProviderID" element={<WithNavbar component={EditProviders} />} />
        
        <Route path="/AddSchool" element={<WithNavbar component={AddSchool} />} />
        <Route path="/AddStudent" element={<WithNavbar component={AddStudent} />} />
        <Route path="/EditStudent/:id" element={<WithNavbar component={EditStudent} />} />
        <Route path="/AssignProviders/:id" element={<WithNavbar component={AssignProviders} />} />
        
      </Routes>
    </Router>
  );
};

export default App;

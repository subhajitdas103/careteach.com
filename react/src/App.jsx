import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import Students from "./Components/Students/Students";
import AddStudent from "./Components/Students/AddStudent";
import EditStudent from "./Components/Students/EditStudent";
import Billing from "./Components/Billing/Billing";
import Providers from "./Components/Providers/Providers";
import School from "./Components/School/School";
import EditSchool from "./Components/School/EditSchool";
import Calendar from "./Components/Calendar/Calendar";
import Holidays from "./Components/Holidays/Holidays";
import AddHoliday from "./Components/Holidays/AddHoliday";
import AddProviders from "./Components/Providers/AddProviders";
import EditProviders from "./Components/Providers/EditProviders";
import AddSchool from "./Components/School/AddSchool";
import AssignProviders from "./Components/Students/AssignProviders";
import ProtectedRoute from './Components/ProtectedRoute';  // Adjust path if needed

import 'react-big-calendar/lib/css/react-big-calendar.css';

// Higher-Order Component to wrap routes with Navbar
const WithNavbar = ({ Component }) => (
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

        {/* Routes for pages that require authentication */}
        <Route 
          path="/Dashboard" 
          element={<ProtectedRoute><WithNavbar Component={Dashboard} /></ProtectedRoute>} 
        />
        <Route 
          path="/Students" 
          element={<WithNavbar Component={Students} />} 
        />
        <Route 
          path="/Billing" 
          element={<WithNavbar Component={Billing} />} 
        />
        <Route 
          path="/Providers" 
          element={<WithNavbar Component={Providers} />} 
        />
        <Route 
          path="/School" 
          element={<WithNavbar Component={School} />} 
        />
        <Route 
          path="/Holidays" 
          element={<WithNavbar Component={Holidays} />} 
        />
        <Route 
          path="/AddHoliday" 
          element={<WithNavbar Component={AddHoliday} />} 
        />
        <Route 
          path="/Calendar" 
          element={<WithNavbar Component={Calendar} />} 
        />
        <Route 
          path="/AddProviders" 
          element={<WithNavbar Component={AddProviders} />} 
        />
        <Route 
          path="/EditProviders/:ProviderID" 
          element={<WithNavbar Component={EditProviders} />} 
        />
        
        <Route 
          path="/AddSchool" 
          element={<WithNavbar Component={AddSchool} />} 
        />
        <Route 
          path="/AddStudent" 
          element={<WithNavbar Component={AddStudent} />} 
        />
        <Route 
          path="/EditStudent/:id" 
          element={<WithNavbar Component={EditStudent} />} 
        />
        <Route 
          path="/AssignProviders/:id" 
          element={<WithNavbar Component={AssignProviders} />} 
        />
        <Route 
          path="/EditSchool/:SchoolID" 
          element={<WithNavbar Component={EditSchool} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;

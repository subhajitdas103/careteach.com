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

        {/* Private Route for Dashboard */}
        <Route 
          path="/Dashboard" 
          element={<ProtectedRoute><WithNavbar Component={Dashboard} /></ProtectedRoute>} 
        />
        
        {/* Private Routes */}
        <Route 
          path="/Students" 
          element={<ProtectedRoute><WithNavbar Component={Students} /></ProtectedRoute>} 
        />
        <Route 
          path="/Billing" 
          element={<ProtectedRoute><WithNavbar Component={Billing} /></ProtectedRoute>} 
        />
        <Route 
          path="/Providers" 
          element={<ProtectedRoute><WithNavbar Component={Providers} /></ProtectedRoute>} 
        />
        <Route 
          path="/School" 
          element={<ProtectedRoute><WithNavbar Component={School} /></ProtectedRoute>} 
        />
        <Route 
          path="/Holidays" 
          element={<ProtectedRoute><WithNavbar Component={Holidays} /></ProtectedRoute>} 
        />
        <Route 
          path="/AddHoliday" 
          element={<ProtectedRoute><WithNavbar Component={AddHoliday} /></ProtectedRoute>} 
        />
        <Route 
          path="/Calendar" 
          element={<ProtectedRoute><WithNavbar Component={Calendar} /></ProtectedRoute>} 
        />
        <Route 
          path="/AddProviders" 
          element={<ProtectedRoute><WithNavbar Component={AddProviders} /></ProtectedRoute>} 
        />
        <Route 
          path="/EditProviders/:ProviderID" 
          element={<ProtectedRoute><WithNavbar Component={EditProviders} /></ProtectedRoute>} 
        />
        <Route 
          path="/AddSchool" 
          element={<ProtectedRoute><WithNavbar Component={AddSchool} /></ProtectedRoute>} 
        />
        <Route 
          path="/AddStudent" 
          element={<ProtectedRoute><WithNavbar Component={AddStudent} /></ProtectedRoute>} 
        />
        <Route 
          path="/EditStudent/:id" 
          element={<ProtectedRoute><WithNavbar Component={EditStudent} /></ProtectedRoute>} 
        />
        <Route 
          path="/AssignProviders/:id" 
          element={<ProtectedRoute><WithNavbar Component={AssignProviders} /></ProtectedRoute>} 
        />
        <Route 
          path="/EditSchool/:SchoolID" 
          element={<ProtectedRoute><WithNavbar Component={EditSchool} /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
};

export default App;

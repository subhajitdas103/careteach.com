import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from './Components/Login/login';
import Dashboard from "./Components/Dashboard/Dashboard";
import Students from "./Components/Students/Students";
import AddStudent from "./Components/Students/AddStudent";
import Billing from "./Components/Billing/Billing";
import Providers from "./Components/Providers/Providers";
import School from "./Components/School/School";
import Calendar from "./Components/Calendar/Calendar";
import Holidays from "./Components/Holidays/Holidays";
import AddHoliday from "./Components/Holidays/AddHoliday";
import AddProviders from "./Components/Providers/AddProviders";
import AddSchool from "./Components/School/AddSchool";
import 'react-big-calendar/lib/css/react-big-calendar.css';

// import ProtectedRoute from "./Components/ProtectedRoute";
// import Navbar from './Components/Navbar';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route path="/" element={<Login />} />
      
        {/* Route for Dashboard */}
        <Route 
          path="/Dashboard" 
          element={
            <>
              <Navbar /> {/* Add the Navbar here */}
             
              <Dashboard />
            </>
          } 
          
        />
        <Route 
          path="/Students" 
          element={
            <>
              <Navbar /> 
              <Students />
            </>
          } 
          />
          <Route 
            path="/AddStudent" 
            element={
              <>
                <Navbar /> 
                <AddStudent />
              </>
            } 
          />
           <Route 
            path="/Billing" 
            element={
              <>
                <Navbar /> 
                <Billing />
              </>
            } 
          />
          <Route 
            path="/Providers" 
            element={
              <>
                <Navbar /> 
                <Providers />
              </>
            } 
          />
          <Route 
            path="/School" 
            element={
              <>
                <Navbar /> 
                <School />
              </>
            } 
          />

          <Route 
            path="/Holidays" 
            element={
              <>
                <Navbar /> 
                <Holidays />
              </>
            } 
          />
             <Route 
            path="/AddHoliday" 
            element={
              <>
                <Navbar /> 
                <AddHoliday />
              </>
            } 
          />
          
      <Route 
        path="/Calendar" 
        element={
            <>
            <Navbar />
            <div style={{ marginTop: '0px' , position: 'static' }}> 
              <Calendar />
            </div>
        </>
        
          } 
        />
         <Route 
            path="/AddProviders" 
            element={
              <>
                <Navbar /> 
                <AddProviders />
              </>
            } 
          />
          <Route 
            path="/AddSchool" 
            element={
              <>
                <Navbar /> 
                <AddSchool />
              </>
            } 
          />
      
      </Routes>
         
    </Router>
  );
};

export default App;

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

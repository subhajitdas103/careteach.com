import { useState } from "react";
import React  from "react";
import axios from 'axios';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import { DatePicker } from 'rsuite';
import { toast, ToastContainer } from 'react-toastify';
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddHoliday = () => {
  const navigate = useNavigate();
  const backToHoliday = () => {
    navigate('/Holidays');
  };
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [holidayName, setHolidayName] = useState('');
  const [startDate, handleStartDateChange] = useState(null);
  const [endDate, handleEndDateChange] = useState(null);

      const handeladdHoliday = async () => {
        if (!holidayName || holidayName.trim() === "") {
          toast.error("Holiday Name is required!");
          return;
        }
      
        if (!startDate || isNaN(new Date(startDate).getTime())) {
          toast.error("Start Date is required and must be a valid date!");
          return;
        }
      
        if (!endDate || isNaN(new Date(endDate).getTime())) {
          toast.error("End Date is required and must be a valid date!");
          return;
        }
      
        // Convert to Date objects for validation
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        if (start > end) {
          toast.error("End Date cannot be earlier than Start Date!");
          return;
        }
      

        const formattedStartDate = start.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const formattedEndDate = end.toLocaleDateString('en-CA'); // YYYY-MM-DD
        
        const holidayData = {
          holidayName: holidayName.trim(),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        try {

            const response = await axios.post(`${backendUrl}/api/addHoliday`, holidayData, {
            headers: { 'Content-Type': 'application/json' },
          });
      
          setTimeout(() => {
            toast.success("Holiday added successfully!", { position: "top-right", autoClose: 5000 });
          }, 500);
      
          navigate('/Holidays', { state: { successMessage: 'Holiday added successfully!' } });
      
        } catch (error) { 
          if (error.response) {
            console.error('Server Error:', error.response.data);
            
            const errorMessage =
               error.response.data.message
              || 'Failed to add holiday';
            
            toast.error(errorMessage);
          } else {
            toast.error('Server not responding');
          }
        }
      };
  
  return (
    <>
   
      <header>
        <div className="dashbord-container">
          <div className="row dashbord-list">
            <div className="heading-text personal-info-text">
              <h3>Add New Holiday</h3>
              <i
                className="fa fa-backward fc-back-icon" onClick={backToHoliday}
                aria-hidden="true"
                id="back_addholiday_click"
              ></i>
            </div>
          </div>

          <div className="row dashbord-list personal-profile">
            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>Holiday Name*</label>
                <input
                  type="text"
                  className="stu-pro-input-field sch-dropbtn"
                  placeholder="Enter Name" value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                />
              </div>
            </div>

            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>Start Date*</label>
                <DatePicker
               
                  value={startDate}
                  placeholder="Enter Start Date"
                  onChange={(e) => handleStartDateChange(new Date(e))}
                  format="MM/dd/yyyy"
                />
              </div>

              <div className="col-md-6 student-profile-field">
                <label>End Date*</label>
                <DatePicker
                  value={endDate}
                  placeholder="Enter End Date"
                  onChange={(e) => handleEndDateChange(new Date(e))}
                   format="MM/dd/yyyy"
                />
              </div>
            </div>
          </div>

          <div className="save-student-btn" onClick={handeladdHoliday}>Save Holiday</div>
             <ToastContainer />
        </div>
      </header>
    </>
  );
};

export default AddHoliday;

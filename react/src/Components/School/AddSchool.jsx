import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'rsuite/styles/index.less'; // Import RSuite styles
import { DatePicker } from 'rsuite';
import validator from 'email-validator';
import { toast, ToastContainer } from 'react-toastify';
import { Checkbox, FormGroup, Button, Popover, List, ListItem } from '@mui/material';

const AddSchool = () => {
  const [apicall, setApiCall] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [SelectedWorkingDays, setSelectedWorkingDays] = useState([]);
  const [schoolName, setSchoolName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [holidays, setHolidays] = useState('Choose Holidays');
  const [status, setStatus] = useState('Inactive');
  const [emailAddress, setEmail] = useState('');

  const navigate = useNavigate();
  const backToSchool = () => {
    navigate('/School');
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handelWorkingDayChange = (event) => {
    const workingday = event.target.name;
    setSelectedWorkingDays((prevWorkingDays) =>
      prevWorkingDays.includes(workingday)
        ? prevWorkingDays.filter((item) => item !== workingday)
        : [...prevWorkingDays, workingday]
    );
  };
console.log(SelectedWorkingDays);
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleHolidayChange = (status) => {
    setHolidays(status);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handelAddSchool = async () => {

    if (!schoolName || !principalName || !address || !phone || !emailAddress) {
      toast.error('Please fill in all fields!');
      return;
    }

   // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailAddress)) {
    toast.error('Enter a valid email!');
    return;
  }

  // Phone number validation (exactly 10 digits)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    toast.error('Phone number must be 10 digits!');
    return;
  }


    const schoolData = {
      schoolName,
      principalName,
      address,
      phone,
      workingDays: SelectedWorkingDays.join(','),
      holidays,
      status,
      emailAddress,
    };
console.log(schoolData);
    try {
      const response = await axios.post('/api/AddSchool', schoolData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('School added successfully!');
    
      console.log('School added successfully:', response.data);
    } catch (error) {
      toast.error('Error adding school!');
      console.error('Error adding school:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text personal-info-text">
          <h3>Add Basic Information of School</h3>
          <i className="fa fa-backward fc-back-icon" onClick={backToSchool} aria-hidden="true"></i>
        </div>
      </div>

      <div className="row dashboard-list personal-profile">
        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>School Name:</label>
            <input
              type="text"
              className="stu-pro-input-field sch-dropbtn"
              placeholder="Enter a school name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Principal Name:</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Principal Name"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
            />
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>Address:</label>
            <textarea
              rows="6"
              cols="50"
              className="text-field stu-pro-input-field"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              className="stu-pro-input-field"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Removes non-numeric characters
                if (value.length <= 12) {
                  setPhone(value);
                }
              }}
            />
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>Working Days:</label>
            <Button className="gradesCSS" onClick={handleDropdownClick} variant="outlined" fullWidth>
              {SelectedWorkingDays.length > 0 ? SelectedWorkingDays.join(', ') : 'Choose Working Days'}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseDropdown}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <List>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((workingday) => (
                  <ListItem key={workingday}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={SelectedWorkingDays.includes(workingday)}
                          onChange={handelWorkingDayChange}
                          name={workingday}
                        />
                      }
                      label={workingday}
                    />
                  </ListItem>
                ))}
              </List>
            </Popover>
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Holidays:</label>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {holidays}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleHolidayChange("Holidays 2024-25")}
                  >
                    Holidays 2024-25
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleHolidayChange("Holidays 2023-2024")}
                  >
                    Holidays 2023-2024
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
              <label>Email:</label>
              <input
                type="email"
                className="stu-pro-input-field"
                placeholder="Enter Email Address"
                value={emailAddress}
                onChange={handleEmailChange}
              />
            </div>

        
          <div className="col-md-6 student-profile-field">
            <label>Status:</label>
            <div className="radio-btn">
              <div className="radio">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                />
                <label>Inactive</label>
              </div>
              <div className="radio">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                />
                <label>Active</label>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="btn btn-primary save-student-btn" onClick={handelAddSchool}>
        Save School
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddSchool;

import React, { useState , useEffect } from 'react';
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
import { useParams } from 'react-router-dom'; // Import useParams
const EditSchool = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [schoolDatabyid, setSchoolData] = useState(null);
  const {SchoolID } = useParams();
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


  // ============Hendel working Days and Shoe Working Name in edit section==========
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

  useEffect(() => {
    if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].working_days) {
      // Split the working_days string into an array
      setSelectedWorkingDays(schoolDatabyid[0].working_days.split(','));
    }
  }, [schoolDatabyid]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
 // ========END====Hendel working Days and Shoe Working Name in edit section==========




// =================Show the Holidays in Edit Page==================
  const handleHolidayChange = (status) => {
    setHolidays(status);
  };


  useEffect(() => {
    if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].holiday) {
      setHolidays(schoolDatabyid[0].holiday); // Initialize holidays if available from schoolDatabyid
    }
  }, [schoolDatabyid]);


// =================Show the Email in edit Page==========================
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  useEffect(() => {
    if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].email) {
      setEmail(schoolDatabyid[0].email);
    }
  }, [schoolDatabyid]);

// ===========END======Show the Email in edit Page==========================




// ==============Status Change show in edit ===================
 useEffect(() => {
  if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].status) {
    setStatus(schoolDatabyid[0].status); // Set status from schoolDatabyid if available
  }
}, [schoolDatabyid]);
// =========================================

// ===================Show the School Name=============================
    
useEffect(() => {
  if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].id) {
    setSchoolName(schoolDatabyid[0].school_name); // Set the school name
  }
}, [schoolDatabyid]);

  const handelSchholNameChange = (e) => {
    setSchoolName(e.target.value);
  };


// ======================Principal Name Change===========================
useEffect(() => {
  if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].id) {
    setPrincipalName(schoolDatabyid[0].principal_name); // Set the school name
  }
}, [schoolDatabyid]);

  const hendelPrincipalNamechange = (e) => {
    setPrincipalName(e.target.value);
  };
// ======================Address Change===========================
useEffect(() => {
if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].id) {
  setAddress(schoolDatabyid[0].address); // Set the school name
}
}, [schoolDatabyid]);

const handelAddressChange = (e) => {
  setAddress(e.target.value);
};
// ======================Phone Change===========================
useEffect(() => {
if (schoolDatabyid && schoolDatabyid[0] && schoolDatabyid[0].id) {
  setPhone(schoolDatabyid[0].phone); // Set the school name
}
}, [schoolDatabyid]);

const handelPhoneChange = (e) => {
let value = e.target.value.replace(/[^0-9]/g, ''); // Removes non-numeric characters
if (value.length <= 10) {
  setPhone(value); // Set the phone number with a maximum of 10 digits
}
};



const handleEditSchool = async () => {
  const validations = [
    { field: schoolName, message: 'Please Enter School Name!' },
    { field: principalName, message: 'Please Enter Principal Name!' },
    { field: address, message: 'Please Enter Address!' },
    { field: phone, message: 'Please Enter Phone Number!' },
    { field: emailAddress, message: 'Please Enter Email Address!' },
  ];

  for (let { field, message } of validations) {
    if (!field) {
      toast.error(message);
      return;
    }
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

  // Ensure SelectedWorkingDays is an array before using .join(',')
  const workingDays = Array.isArray(SelectedWorkingDays) ? SelectedWorkingDays.join(',') : '';

  const schoolData = {
    schoolName,
    principalName,
    address,
    phone,
    workingDays,
    holidays,
    status,
    emailAddress,
  };

  try {
    const response = await axios.post(`${backendUrl}/api/EditSchool/${SchoolID}`, schoolData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTimeout(() => {
      toast.success('School Updated successfully!', {
        position: 'top-right',
        autoClose: 5000,
      });
    }, 500);

    navigate('/School', { state: { successMessage: 'School Updated successfully!!' } });
  } catch (error) {
    if (error.response) {
      // console.log('Full error response:', error.response);
      if (error.response.status === 422) {
        const errorMessage = error.response.data.errors?.emailAddress?.[0] || 'The email address is already registered';
        console.log('Validation error:', errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error('Error updating school!');
      }
    } else {
      toast.error('Server not responding');
    }
  }
};





   

  //============================Fect School Data====================
  const FetchSchoolDataBYID = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/FetchSchoolDataBYID/${SchoolID}`);
      const data = await response.json();
      setSchoolData(data); 
      // console.log("SchholDataByID",data);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    }
  };

  useEffect(() => {
    if (SchoolID) {
        FetchSchoolDataBYID();  
    }
  }, [SchoolID]);
  // ========END====Fect School Data==========================

    



  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text personal-info-text">
          <h3 style={{marginTop: "-42px",marginLeft:"17px"}}>Edit School</h3>
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
              onChange={handelSchholNameChange}
            />
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Principal Name:</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Principal Name"
              value={principalName}
              onChange={hendelPrincipalNamechange}
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
              onChange={handelAddressChange}
            ></textarea>
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              className="stu-pro-input-field"
              placeholder="Enter phone number"
              value={phone}
              onChange={
                  handelPhoneChange}
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

      <div className="btn btn-primary save-student-btn" onClick={handleEditSchool}>
        Save School
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default EditSchool;

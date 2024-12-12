import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from "axios";
import 'rsuite/styles/index.less'; // Import RSuite styles
import { DatePicker } from 'rsuite';
// import isEmail from 'react-email-validator';
import validator from 'email-validator';  // Import the validator // Default import
// import InputMask from 'react-input-mask';
import { toast, ToastContainer } from 'react-toastify';
import { Checkbox, FormGroup, Button, Popover, List, ListItem } from '@mui/material';


const ProviderForm = () => {
  const [anchorEl, setAnchorEl] = useState(null); 
  const [error, setError] = useState('');
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rate, setRate] = useState('');
  const [rateNotes, setRateNotes] = useState('');
  const [selectedform, setForm] = useState('F1');
  const [companyName, setCompanyName] = useState('');
  // const [selectedGrade, setSelectedGrade] = useState('Choose Grades'); 
  const [selectedGrades, setSelectedGrades] = useState([]);
  // const [grades, setGrades] = useState([]);
  const [licenseExpDateApplicable, setLicenseExpDateApplicable] = useState('Yes');
  const [licenseExpDate, setLicenseExpDate] = useState(null);
  const [petStatus, setPetStatus] = useState('Choose Pets Status');

  const [petsApprovalDate, setPetsApprovalDate] = useState(null); 
  const [bilingual, setBilingual] = useState('Yes'); 
  const [notes, setNotes] = useState('');
  const [ssNumber, setSSNumer] = useState('');
  const [status, setStatus] = useState('Active');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    console.log('First Name:', event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    console.log('Last Name:', event.target.value);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date); 
  };



  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validator.validate(value)); 
    // setIsValid(isEmailValid);
    
    // Validate using the email-validator package
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit length to 12
    if (/^\d{0,12}$/.test(value)) {
      setPhone(value);
    }
  };
  const handleAddressChange = (e) => {
    const value = e.target.value;
    // Limit address input to 200 characters
    if (value.length <= 200) {
      setAddress(value);
    }
  };


   // Handle rate input change, allow only numeric values (with optional decimals) and limit length
   const handleRateChange = (e) => {
    const value = e.target.value;
    // Allow only numbers or decimals (max 10 digits, with 2 decimal places)
    if (/^\d{0,10}(\.\d{0,2})?$/.test(value)) {
      setRate(value);
    }
  };

 // Handle rate notes input change, allow text with a maximum length (e.g., 500 characters)
 const handleRateNotesChange = (e) => {
  const value = e.target.value;
  // Limit rate notes input to 500 characters
  if (value.length <= 500) {
    setRateNotes(value);
  }
};

const handleCompanyNameChange = (e) => {
  const value = e.target.value;
  setCompanyName(value); // Update the company name state
};

const handleFormChange = (e) => {
  setForm(e.target.value); // Update the selected form value (F1 or F2)
};

const handleGradeChange = (event) => {
  const grade = event.target.name;
  setSelectedGrades((prevGrades) =>
    prevGrades.includes(grade)
      ? prevGrades.filter((item) => item !== grade)
      : [...prevGrades, grade]
  );
};
const handleDropdownClick = (event) => {
  setAnchorEl(event.currentTarget); // Open dropdown
};

const handleCloseDropdown = () => {
  setAnchorEl(null); // Close dropdown
};

const open = Boolean(anchorEl); // Check if dropdown is open
const id = open ? 'simple-popover' : undefined;




  // Handle radio button change
  const handleLicenseExpDateChange = (event) => {
    setLicenseExpDateApplicable(event.target.value); // Update the state with selected radio option
  };
  const handleLicenseExpDateChangeDate = (date) => {
    setLicenseExpDate(date); // Update the state with selected date
  };


  const handlePetStatusChange = (status) => {
    setPetStatus(status); // Update the pet status state with the selected option
  };

  const handlePetsApprovalDateChange = (date) => {
    setPetsApprovalDate(date); // Update the state with selected date
  };


  const handleBilingualChange = (event) => {
    setBilingual(event.target.value); // Update the state with selected value
  };
  
    const handleSSnumberChange = (event) => {
      let value = event.target.value;
      value = value.replace(/[^0-9-]/g, '');
      if (value.length <= 11) {
        value = value
          .replace(/^(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/^(\d{3}-\d{2})(\d{1,4})/, '$1-$2');
      }
      setSSNumer(value);

      if (value.match(/^\d{3}-\d{2}-\d{3}$/) || value === '') {
        setError(''); 
      } else {
        setError('Invalid SSN format. Please enter as 111-222-222.');
      }
    };
  
  const handleNotesChange = (event) => {
    setNotes(event.target.value); // Update the state with the entered notes
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the state with the selected value
  };
  const addProviderClick  = async (event) => {
    console.log("handleAddProvider triggered");
    // event.preventDefault();


   
    const formData = {
      first_name,
      last_name,
      selectedDate,
      email,
      phone,
      address,
      rate,
      rateNotes,
      selectedform,
      companyName,
      selectedGrades,
      licenseExpDateApplicable,
      licenseExpDate,
      petStatus,
      petsApprovalDate,
      bilingual,
      ssNumber,
      notes,
      status
    };
    console.log('Form data:', formData);

    try {
      const response = await axios.post('/api/addprovider', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success("Student successfully Saved!", {
        position: "top-right", 
        autoClose: 5000,
      });

      console.log('Data sent successfully:', response.data);  
    } 
    
    catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right", // Correct syntax
        autoClose: 5000,
      });

      console.error('There was an error sending data:', error.response?.data || error.message);
    }
  }

  const bcktoprovidersView = () => {
    navigate('/Providers');
  };
  const navigate = useNavigate();
  return (
    <div className="dashbord-container">
      <header>
        <div className="row dashbord-list">
          <div className="heading-text personal-info-text">
            <h3>Basic Information</h3>
            <i
              className="fa fa-backward fc-back-icon"
              aria-hidden="true"
              id="back_addpro_click" onClick={bcktoprovidersView}
            ></i>
          </div>
        </div>

        <div className="row dashbord-list personal-profile">
          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
              <label>First Name:</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter first name" value={first_name} onChange={handleFirstNameChange}
              />
            </div>
            <div className="col-md-6 student-profile-field">
              <label>Last Name:</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter last name" value={last_name} onChange={handleLastNameChange}
              />
            </div>
          </div>

          <div className="stu-pro-field-div">
                <div className="col-md-6 student-profile-field ">
                  <label>Date of Birth:</label>
                  <DatePicker
                    className=""
                    placeholdertext="Enter Date of Birth" 
                    selected={selectedDate} 
                    onChange={handleDateChange} 
                    style={{ width: "100%", height: "45px" }}
                  />
                </div>
                <div className="col-md-6 student-profile-field">
                  <label>Email:</label>
                  <input
                    type="text"
                    className={`stu-pro-input-field ${isValid ? '' : 'invalid-email'}`}
                    placeholder="Enter Email Addresss"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {!isValid && <p className="error-message">Invalid email address</p>}
                </div>
          </div>

          <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>Phone:</label>
                <input
                  type="text"
                  className="stu-pro-input-field"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 student-profile-field">
              <label>Address:</label>
              <textarea
                rows="3"
                cols="30"
                className="text-field stu-pro-input-field"
                placeholder="Enter Address"
                value={address}
                onChange={handleAddressChange}
                maxLength="200" // Restrict input to 200 characters
              ></textarea>
            </div>
          </div>
        </div>

        <div className="row dashbord-list">
          <div className="heading-text parent-info-text">
            <h3>Other Information</h3>
          </div>
        </div>

        <div className="row dashbord-list personal-profile">
            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
              <label>Rate:</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter Rate"
                value={rate}
                onChange={handleRateChange}
              />
            </div>
            <div className="col-md-6 student-profile-field">
              <label>Rate Notes:</label>
              <textarea
                rows="3"
                cols="30"
                className="text-field stu-pro-input-field"
                placeholder="Enter Rate Notes"
                value={rateNotes}
                onChange={handleRateNotesChange}
                maxLength="500" // Restrict input to 500 characters
              ></textarea>
            </div>
        </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Select Form:</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={selectedform}
                  onChange={handleFormChange}
                >
                  <FormControlLabel value="F1" control={<Radio />} label="F1" />
                  <FormControlLabel value="F2" control={<Radio />} label="F2" />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="col-md-6 student-profile-field">
              <label>Company Name:</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={handleCompanyNameChange} // Handle input change
              />
            </div>
          </div>


  <div className="stu-pro-field-div">
      <div className="col-md-6 student-profile-field">
          <label>Grades Approved for:</label>
          <Button className="gradesCSS" onClick={handleDropdownClick} variant="outlined" fullWidth>
            {selectedGrades.length > 0 ? selectedGrades.join(', ') : 'Choose Grades'}
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
              {['A', 'B', 'C'].map((grade) => (
                <ListItem key={grade}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedGrades.includes(grade)}
                        onChange={handleGradeChange}
                        name={grade}
                      />
                    }
                    label={grade}
                  />
                </ListItem>
              ))}
            </List>
          </Popover>
      </div>
            

            <div className="col-md-6 student-profile-field">
              <FormControl>
                <FormLabel id="license-exp-date-applicable">License Exp Date Applicable?</FormLabel>
                <RadioGroup
                  aria-labelledby="license-exp-date-applicable"
                  name="controlled-radio-buttons-group"
                  value={licenseExpDateApplicable} // Bind the value of the radio group to the state
                  onChange={handleLicenseExpDateChange} // Handle change for radio buttons
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>

        <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
              <label>License Exp Date:</label>
              <DatePicker
                selected={licenseExpDate}
                onChange={handleLicenseExpDateChangeDate}
                className=""
                placeholdertext="Enter License Exp Date"
                style={{ width: '100%', height: '45px' }}
              />
            </div>

               
        <div className="col-md-6 student-profile-field">
          <label>Pet Status:</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle stu-pro-input-field"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {petStatus}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handlePetStatusChange("Service A")}
                >
                  Service A
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handlePetStatusChange("Service B")}
                >
                  Service B
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
        
        <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field">
                <label>PETS Approval Date:</label>
                <DatePicker
                  selected={petsApprovalDate}
                  onChange={handlePetsApprovalDateChange}
                  className=""
                  placeholdertext="Enter PETS Approval Date"
                  style={{ width: '100%', height: '45px' }}
                />
              </div>
                <div className="col-md-6 student-profile-field">
                <FormControl component="fieldset">
                    <FormLabel component="legend">Bilingual</FormLabel>
                    <RadioGroup
                      aria-labelledby="bilingual-radio-group"
                      name="bilingual-radio-group"
                      value={bilingual} // Set the selected value
                      onChange={handleBilingualChange} // Handle radio button change
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </div>
        </div>

            <div className="stu-pro-field-div">
                  <div className="col-md-6 student-profile-field attachmentcss">
                    <label htmlFor="ssn-input">Social Security Number:</label>
                    <input
                      id="ssn-input"
                      type="text"
                      value={ssNumber}
                      onChange={handleSSnumberChange}
                      className="stu-pro-input-field"
                      placeholder="Enter SSN"
                      maxLength="10"
                    />
                     {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                </div>
                <div className="col-md-6 student-profile-field  attachmentcss">
                  <label>Notes:</label>
                  <input
                    type="text"
                    className="stu-pro-input-field"
                    placeholder="Enter Some Notes"
                    value={notes} 
                    onChange={handleNotesChange} 
                  />
                </div>
              </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
                <FormControl component="fieldset">
                  <FormLabel component="legend">Status:</FormLabel>
                  <RadioGroup
                    aria-labelledby="status-radio-group"
                    name="status-radio-group"
                    value={status} // Set the selected value
                    onChange={handleStatusChange} // Handle radio button change
                  >
                    <FormControlLabel value="Active" control={<Radio />} label="Active" />
                    <FormControlLabel value="In-Active" control={<Radio />} label="In-Active" />
                  </RadioGroup>
              </FormControl>
            </div>
          </div>
      </div>

        {/* <div className="save-student-btn">Save Provider</div> */}

        <div>
              <button id="addProviderBtn" className="save-student-btn" onClick={addProviderClick}>Save Provider</button>
              <ToastContainer />
            </div>
      </header>
    </div>
  );
};

export default ProviderForm;

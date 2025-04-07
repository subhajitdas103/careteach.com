import React, { useState,useEffect } from "react";
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
import validator from 'email-validator';
import { toast, ToastContainer } from 'react-toastify';
import { Checkbox, FormGroup, Button, Popover, List, ListItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { PropagateLoader } from "react-spinners";
// import logo from "../assets/logo.png"; 
import logo from "../../Assets/logo.png";
const EditProviders = () => {
const [loading, setLoading] = useState(true);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const {ProviderID } = useParams();
const [allProviderData, setProviderData] = useState(null);
const [providerData, setAllProviderData] = useState({});
// console.log(ProviderID);
  const [anchorEl, setAnchorEl] = useState(null);  // For choose Grade Checkbox
  const [error, setError] = useState(''); // For Showing Error in Span
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
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [licenseExpDateApplicable, setLicenseExpDateApplicable] = useState('Yes');
  const [licenseExpDate, setLicenseExpDate] = useState(null);
  const [petStatus, setPetStatus] = useState('Choose Pets Status');
  const [petsApprovalDate, setPetsApprovalDate] = useState(null); 
  const [bilingual, setBilingual] = useState('Yes'); 
  const [notes, setNotes] = useState('');
  const [ssNumber, setSSNumer] = useState('');
  const [status, setStatus] = useState('active');
// ==========================First Name====================================
const handleFirstNameChange = (event) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);
    console.log('First Name:', newFirstName); // Log the new value as the user types
  };

  useEffect(() => {
    // Check if providerData exists and if it has data
    if (providerData && providerData[0] && providerData[0].provider_first_name) {
      setFirstName(providerData[0].provider_first_name);  // Set first name from the fetched data
      console.log('First Name set from provider data:', providerData[0].provider_first_name);  // Log the first name from provider data
    }
  }, [providerData]);

// ==========================Last Name====================================
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    console.log('Last Name:', event.target.value);
  };
  useEffect(() => {
    // Check if providerData exists and if it has data
    if (providerData && providerData[0] && providerData[0].provider_last_name) {
        setLastName(providerData[0].provider_last_name);  // Set first name from the fetched data
      console.log('Last Name set from provider data:', providerData[0].provider_first_name);  // Log the first name from provider data
    }
  }, [providerData]);
//   ==================DOB=================================

  const handleDateChange = (date) => {
    setSelectedDate(date); 
  };
 // Set date from provider data on component mount or when providerData changes
 useEffect(() => {
    if (providerData && providerData[0] && providerData[0].provider_dob) {
      const dob = new Date(providerData[0].provider_dob); // Convert 'YYYY-MM-DD' to Date object
      if (!isNaN(dob)) {
        setSelectedDate(dob); // Only set the date if it's valid
        console.log('DOB from provider data:', dob);
      } else {
        console.error('Invalid DOB format:', providerData[0].provider_dob);
      }
    }
  }, [providerData]);
  
// =================Email============================
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validator.validate(value)); 
  };

  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].provider_email) {
        setEmail(providerData[0].provider_email); 
      
    }
  }, [providerData]);

// =================Phone Number================================
  const handleIPhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setPhone(value);
    }
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].provider_phone) {
        setPhone(providerData[0].provider_phone); 
    }
  }, [providerData]);

//   ================Address====================
  const handleAddressChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setAddress(value);
    }
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].provider_address) {
        setAddress(providerData[0].provider_address); 
    }
  }, [providerData]);

//   ==============Rate ===================
   const handleRateChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}(\.\d{0,2})?$/.test(value)) {
      setRate(value);
    }
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].rate) {
        setRate(providerData[0].rate); 
    }
  }, [providerData]);

//   -============Rate notes===============
 const handleRateNotesChange = (e) => {
  const value = e.target.value;
  if (value.length <= 500) {
    setRateNotes(value);
  }
};
useEffect(() => {
    if (providerData && providerData[0] && providerData[0].rate_notes) {
        setRateNotes(providerData[0].rate_notes); 
    }
  }, [providerData]);

//   ================Company Name=================
const handleCompanyNameChange = (e) => {
  const value = e.target.value;
  setCompanyName(value); // Update the company name state
};
useEffect(() => {
    if (providerData && providerData[0] && providerData[0].company_name) {
        setCompanyName(providerData[0].company_name); 
    }
  }, [providerData]);


//   =============Form Change=============

const handleFormChange = (e) => {
  setForm(e.target.value); // Update the selected form value (F1 or F2)
};

useEffect(() => {
    if (providerData && providerData[0] && providerData[0].form) {
        setForm(providerData[0].form); 
        console.log(providerData); 
    }
  }, [providerData]);
//   ===============================Grade Change=============================

const handleGradeChange = (event) => {
  const grade = event.target.name;
  setSelectedGrades((prevGrades) =>
    prevGrades.includes(grade)
      ? prevGrades.filter((item) => item !== grade)
      : [...prevGrades, grade]
  );
};
useEffect(() => {
  if (providerData && providerData[0] && providerData[0].grades_approved) {
    const grades = providerData[0].grades_approved.split(','); // Convert CSV string to an array
    setSelectedGrades(grades);
  }
}, [providerData]);

  

//   =================================


  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

//   ===============Lisence Exp Date==================
  const handleLicenseExpDateChange = (event) => {
    setLicenseExpDateApplicable(event.target.value); 
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].license_exp_date_applicable) {
        setLicenseExpDateApplicable(providerData[0].license_exp_date_applicable); 
    }
  }, [providerData]);

//   =========================Lisence Date ========================
  const handleLicenseExpDateChangeDate = (date) => {
    setLicenseExpDate(date);
  };

  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].license_exp_date) {
      const expdateChangeLicenseExpDate = new Date(providerData[0].license_exp_date); // Convert 'YYYY-MM-DD' to Date object
      if (!isNaN(expdateChangeLicenseExpDate)) {
        setLicenseExpDate(expdateChangeLicenseExpDate); // Only set the date if it's valid
        console.log(' from provider datahhhhhh:', expdateChangeLicenseExpDate);
      } else {
      
      }
    }
  }, [providerData]);
// ================Pets Status===========================
  const handlePetStatusChange = (status) => {
    setPetStatus(status);
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].pets_status) {
        setPetStatus(providerData[0].pets_status); 
    }
  }, [providerData]);

//   =============Pets Approval date=================
  const handlePetsApprovalDateChange = (date) => {
    setPetsApprovalDate(date);
  };
 

  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].pets_approval_date) {
      const expdateChange = new Date(providerData[0].pets_approval_date); // Convert 'YYYY-MM-DD' to Date object
      if (!isNaN(expdateChange)) {
        setPetsApprovalDate(expdateChange); // Only set the date if it's valid
        console.log(' from provider datbbbbba:', expdateChange);
      } else {
      
      }
    }
  }, [providerData]);
// =================Bilingual=============
  const handleBilingualChange = (event) => {
    setBilingual(event.target.value);
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].bilingual) {
        setBilingual(providerData[0].bilingual); 
    }
  }, [providerData]);
//   ==================SS Number=====================
  
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
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].ss_number) {
        setSSNumer(providerData[0].ss_number); 
    }
  }, [providerData]);


//   =====================Notes=================
  const handleNotesChange = (event) => {
  setNotes(event.target.value); 
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].notes) {
        setNotes(providerData[0].notes); 
    }
  }, [providerData]);
// =============Active Status===================

  const handleStatusChange = (event) => {
  setStatus(event.target.value);
  };
  useEffect(() => {
    if (providerData && providerData[0] && providerData[0].status) {
        setStatus(providerData[0].status); 
        // console.log("nsdj",providerData[0].status);
    }
  }, [providerData]);

  // API Call Fnc
  const addProviderClick  = async (event) => {
  console.log("handleAddProvider triggered");

// ==================================Date format to save in db==================================
  const formattedDOB = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;
  const lisenceExpDateFormat = licenseExpDate ? new Date(licenseExpDate).toISOString().split('T')[0] : null;
  const PetsApprovalDateFormat = petsApprovalDate ? new Date(petsApprovalDate).toISOString().split('T')[0] : null;
  if (!first_name) {
        toast.error('Please fill First Name!');
        return;
    }
  if (!last_name) {
        toast.error('Please fill Last Name!');
        return;
    }

  if (!email) {
        toast.error('Please Enter Email Address!');
        return;
    }

  if (!phone) {
        toast.error('Please Enter Phone Number!');
        return;
    }
  if (!address) {
          toast.error('Please Enter Address!');
          return;
      }
  if (!rate) {
          toast.error('Please Enter Rate!');
          return;
      }
  if (!licenseExpDate) {
          toast.error('Please Enter License Exp Date!');
          return;
      }
  if (!petsApprovalDate) {
    toast.error('Please Enter Pats Approval Date!');
    return;
    }
  if (!ssNumber) {
    toast.error('Please Enter SS Number!');
    return;
    }
  if (!petStatus) {
    toast.error('Please Choose Pets Status!');
    return;
    }
  if (!companyName) {
      toast.error('Please Enter Company Name!');
      return;
    }
  if (!rateNotes) {
    toast.error('Please Enter Rate Notes!');
    return;
    }
   
const formData = {
    first_name,
    last_name,
    selectedDate: formattedDOB,
    email,
    phone,
    address,
    rate,
    rateNotes,
    selectedform,
    companyName,
    selectedGrades:selectedGrades.join(','),
    licenseExpDateApplicable,
    licenseExpDate: lisenceExpDateFormat,
    petStatus,
    petsApprovalDate: PetsApprovalDateFormat,
    bilingual,
    ssNumber,
    notes,
    status
  };
  console.log('Form data:', formData);
   if (formData.selectedGrades.length === 0) {
        toast.error("Please Select Grade.", {
          position: "top-right",
          autoClose: 5000,
        });
        return; // Prevent the form submission
      }
  try {
    const response = await axios.post(`${backendUrl}/api/UpdateProvider/${ProviderID}`, JSON.stringify(formData), {
      headers: {
        
        'Content-Type': 'application/json',
      },
    });
  
    setTimeout(() => {
                  toast.success("Provider successfully Saved!", {
                    position: "top-right",
                    autoClose: 5000,
                  });
                }, 500);
       
    navigate('/Providers', { state: { successMessage: 'Provider successfully Saved!!' } }); 
  } catch (error) {
    if (error.response && error.response.data.error === 'Email is already associated with another provider.') {
      // Show error message for duplicate email
      toast.error("Email is already associated with another provider.", {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      // General error message
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  
    console.error('There was an error sending data:', error.response?.data || error.message);
  }

  }

  const bcktoprovidersView = () => {
    navigate('/Providers');
  };
  const navigate = useNavigate();


  
//   ============================Fect Provider Data====================

const fetchProviderDetails = async () => {
  setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/ProviderDataFetchAsID/${ProviderID}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const allProvider = await response.json();

      setAllProviderData(allProvider); 

    } catch (error) {
      console.error('Error fetching provider details:', error);
    }

    finally {
      setLoading(false); // Hide loader after the fetch completes
    }
  };

  useEffect(() => {
    if (ProviderID) {
      fetchProviderDetails();  // Fetch details when ProviderID changes
    }
  }, [ProviderID]);
    // ================================================

  return (
  <div className="dashbord-container">
      {loading ? (
      <div className="loader-container">
        <div className="loader-content">
          <img src={logo} alt="Loading..." className="logo-loader" />
          <PropagateLoader color="#3498db" size={10} />
        </div>
      </div>
    ) : (
    <>
      <header>
        <div className="row dashbord-list">
          <div className="heading-text personal-info-text">
          <h3 style={{ marginTop: "-44px" }}>Edit Providers</h3>

            <i
              className="fa fa-backward fc-back-icon"
              aria-hidden="true"
              id="back_addpro_click" onClick={bcktoprovidersView}
            ></i>
          </div>
        </div>
        <h2 style={{ 
        color: "#4979a0", 
        fontSize: "24px", 
        fontWeight: "bold", 
        marginBottom: "10px", 
        marginLeft: "26px" 
        }}>
          Basic Information
        </h2>


        <div className="row dashbord-list personal-profile">
          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
              <label>First Name*</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter first name" value={first_name} onChange={handleFirstNameChange}
              />
            </div>
            <div className="col-md-6 student-profile-field">
              <label>Last Name*</label>
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
                    value={selectedDate} // Bind the selected date to the DatePicker
                    onChange={handleDateChange}
                    format="MM/dd/yyyy" // Set the date format to "DD/MM/YYYY"
                    placeholder="Enter Date of Birth"
                    style={{ width: "100%", height: "45px" }}
                
                />  
                </div>
                <div className="col-md-6 student-profile-field">
                  <label>Email*</label>
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
                <label>Phone*</label>
                <input
                  type="text"
                  className="stu-pro-input-field"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={handleIPhoneNumberChange}
                />
              </div>
              <div className="col-md-6 student-profile-field">
              <label>Address*</label>
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
              <label>Rate*</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter Rate"
                value={rate}
                onChange={handleRateChange}
              />
            </div>
            <div className="col-md-6 student-profile-field">
              <label>Rate Notes*</label>
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
              <label>Company Name*</label>
              <input
                type="text"
                className="stu-pro-input-field"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={handleCompanyNameChange}
              />
            </div>
          </div>


         <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
                <label>Grades Approved for*</label>
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
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'K'].map((grade) => (
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
                <FormLabel id="license-exp-date-applicable">License Exp. Date Applicable?</FormLabel>
                <RadioGroup
                  aria-labelledby="license-exp-date-applicable"
                  name="controlled-radio-buttons-group"
                  value={licenseExpDateApplicable}
                  onChange={handleLicenseExpDateChange}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>

         <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field">
              <label>License Exp. Date*</label>
                <DatePicker
                    value={licenseExpDate} // Bind the selected date to the DatePicker
                    onChange={handleLicenseExpDateChangeDate} // Handle the change of the date
                    format="MM/dd/yyyy" 
                    placeholder="License Exp. Date"
                   // Format the date to "DD/MM/YYYY"
                    style={{ width: "100%", height: "45px" }}
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
                      onClick={() => handlePetStatusChange("Pending")}
                    >
                      Pending
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handlePetStatusChange("Approved")}
                    >
                      Approved
                    </button>
                  </li>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handlePetStatusChange("Declined")}
                    >
                      Declined
                    </button>
                  </li>
                </ul>
              </div>
            </div>
        </div>
        
        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>PETS Approval Date*</label>
            <DatePicker
                value={petsApprovalDate}
                onChange={handlePetsApprovalDateChange} // Handle the change of the date
                placeholder="Enter PETS Approval Date"
                format="MM/dd/yyyy" // Format the date to "DD/MM/YYYY"
                style={{ width: "100%", height: "45px" }}
            />
          </div>
            <div className="col-md-6 student-profile-field">
              <FormControl component="fieldset">
                {/* <FormLabel component="legend">Bilingual</FormLabel> */}
                <label>Bilingual:</label>
                <RadioGroup
                  aria-labelledby="bilingual-radio-group"
                  name="bilingual-radio-group"
                  value={bilingual}
                  onChange={handleBilingualChange}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
        </div>

            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field attachmentcss">
                <label htmlFor="ssn-input">Social Security Number*</label>
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
                  {/* <FormLabel component="legend">Status:</FormLabel> */}
                  <label>Status:</label>
                  <RadioGroup
                    aria-labelledby="status-radio-group"
                    name="status-radio-group"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="inactive" control={<Radio />} label="In-Active" />
                  </RadioGroup>
              </FormControl>
            </div>
          </div>
      </div>

      <div>
        <button id="addProviderBtn" className="save-student-btn" onClick={addProviderClick}>Save  Provider</button>
        <ToastContainer />
      </div>
    </header>
      </>
      )}
    </div>
     
  );
};

export default EditProviders;

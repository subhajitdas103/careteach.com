import React, { useState , useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./Students.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import 'rsuite/styles/index.less';
import { DatePicker } from 'rsuite';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import React, { useState } from 'react';

  const AddStudent = () => {
    const { id } = useParams();
  
    const [student, setStudent] = useState(null);
    const [parent, setParentData] = useState(null);
    const [StudentServices, setStudentServices] = useState(null);
  
  const navigate = useNavigate();

  //==============================================================
    const backtostudent = () => {
      navigate('/Students'); 
    };


    
   
  // ==========================Clone Service Div====================================

  const [formDataList, setFormDataList] = useState([
    { service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: ''}
  ]);
  useEffect(() => {
    if (StudentServices && StudentServices.length > 0) {
      const updatedFormDataList = StudentServices.map(service => ({
        service_type: service.service_type || '',
        startDate: service.start_date || '',
        endDate: service.end_date || '',
        weeklyMandate: service.weekly_mandate || '',
        yearlyMandate: service.yearly_mandate || '',
      }));
      setFormDataList(updatedFormDataList);
    }
  }, [StudentServices]);
  

  const handleInputChange = (index, field, value) => {
    const updatedFormDataList = [...formDataList];
    updatedFormDataList[index][field] = value;
    setFormDataList(updatedFormDataList);
  };

  const handleServiceTypeChange = (index, type) => {
    const updatedFormDataList = [...formDataList];
    updatedFormDataList[index] = {
      ...updatedFormDataList[index],
      service_type: type,
    };
    setFormDataList(updatedFormDataList);
  };

  const addService = () => {
    setFormDataList([
      ...formDataList,
      { service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '' }
    ]);
  };

const removeService = (index) => {
  if (formDataList.length > 1) {
  const updatedFormDataList = formDataList.filter((_, i) => i !== index);
  setFormDataList(updatedFormDataList);
  }
};
  // ===================================================================

  const [resolutionInvoice, setResolutionInvoice] = useState(false);

  const handleCheckboxChange = (e) => {
    setResolutionInvoice(e.target.checked);
  };
    
    const [first_name, setFirstName] = useState(student?.first_name || '');

    const [last_name, setLastName] = useState(student?.last_name || '');
    const [grade, setGrade] = useState("");
    const [school_name, setSchoolName] = useState(student?.school_name || '');
    const [home_address, setHomeaddress] = useState(student?.home_address || '');
    const [doe_rate, setDOE] = useState(student?.doe_rate || '');
    const [iep_doc, setIEP] = useState("");
    const [disability, setDisability] = useState("");
    const [nyc_id, setNYC] = useState(student?.nyc_id || '');
    const [notesPerHour, setNotesPerHour] = useState(student?.notesPerHour || '');
    const [case_v, setCase] = useState(student?.case_v || '');
    const [status, setStatus] = useState("");
    const resolutionInvoiceValue = resolutionInvoice ? 'yes' : 'no';


    // ------------------Parent---------
    const [parent_name, setParent] = useState(parent?.parent_name || '');
    const [parent_email, setParentEmail] = useState(parent?.parent_email || '');
    const [parent_type, setParentType] = useState(parent?.parent_type || '');
    const [parent_phnumber, setParentPH] = useState("");
  // ---------------------Parent END------------------------

// =========Parent Name ============
  useEffect(() => {
    if (parent && parent.parent_name) {
      setParent(parent.parent_name); 
    }
  }, [parent]);

    const handleParentname = (event) => {
      setParent(event.target.value);
    };

// ==============Parent Email=================
useEffect(() => {
  if (parent && parent.parent_email) {
    setParentEmail(parent.parent_email); 
  }
}, [parent]);

    const handleParentEmail = (event) => {
      setParentEmail(event.target.value);
    };
// ===============Parent PH Number========================
useEffect(() => {
  if (parent && parent.ph_no) {
    setParentPH(parent.ph_no); 
  }
}, [parent]);

    const handleParentPHnumber = (event) => {
      setParentPH(event.target.value);
    };
// ==============Parent Type==========
    useEffect(() => {
      if (parent && parent.parent_type) {
        setParentType(parent.parent_type); 
      }
    }, [parent]);
  const handleParentTypeChange = (selectedParent) => {
    setParentType(selectedParent);
  };
    // =================Status===================


    useEffect(() => {
      if (student && student.status) {
        setStatus(student.status); // Set initial status from student data
      }
    }, [student]);

    const handleRadioChange = (event) => {
      setStatus(event.target.value);
    };
    // ================First Name================
    useEffect(() => {
      if (student && student.first_name) {
        setFirstName(student.first_name);
      }
    }, [student]);
    

    const handleFirstNameChange = (e) => {
      setFirstName(e.target.value);
      if (e.target.value) {
        setFirstNameError(''); 
      }
    };
  // =======================Last Name=======================
    useEffect(() => {
    if (student && student.last_name) {
      setLastName(student.last_name);
    }
    }, [student]);

      const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        if (event.target.value) {
          setLastNameError('');
        }
      };
    // =================School=============================
    useEffect(() => {
      if (student && student.school_name) {
        setSchoolName(student.school_name);
      }
    }, [student]);
    

    const handleSchoolNameChange = (event) => {
      setSchoolName(event.target.value);
      if (event.target.value) {
        setSchoolNameError('');
      }
    };
    // ====================Home Address=====================
    useEffect(() => {
      if (student && student.home_address) {
        setHomeaddress(student.home_address);
      }
    }, [student]);
    const handleHomeAddress = (event) => {
      setHomeaddress(event.target.value);
      if (event.target.value) {
        setHomeNameError('');  // Clear the error as soon as the user types something
      }
    };

    // =====================Grade=======================
    useEffect(() => {
      if (student && student.grade) {
        setGrade(student.grade);  // Update state when student.grade changes
      }
    }, [student]); // Dependency on both student and grade to keep the state synced

    
    const handleGradeChange = (selectedGrade) => {
      setGrade(selectedGrade);
        setLastNameError(''); 
    };

    // ================IEP Doc=============
    useEffect(() => {
      if (student && student.iep_doc) {
        setIEP(student.iep_doc); 
      }
    }, [student]); 

    
  // Handle grade change
  const handelIEP = (selectedIEP) => {
    setIEP(selectedIEP);

  };

  // ============Clasification of Disability ============
  useEffect(() => {
    if (student && student.disability) {
      setDisability(student.disability); 
    }
  }, [student]); 

  const handelDisability = (selectedDisability) => {
    setDisability(selectedDisability);
    setLastNameError('');
  };

    // ===============DOE Rate==================

    useEffect(() => {
      if (student && student.doe_rate) {
        setDOE(student.doe_rate);
      }
    }, [student]);
    

    const handelDoe_rate = (event) => {
    const value = event.target.value;
 
    if (/^\d+$/.test(value) || value === "") {
      setDOE(value); 
    }

    if (event.target.value) {
      setDOEError('');
    }
  };
// =================NYC ID==================================
useEffect(() => {
  if (student && student.nyc_id) {
    setNYC(student.nyc_id);
  }
}, [student]);

    const handelNycID = (event) => {
      const value = event.target.value;
      // Allow only numeric input (whole numbers)
    if (/^\d+$/.test(value) || value === "") {
      setNYC(value); // Update state if input is valid
    }
    };

    // ==================Notes Per Hour=======================
        const handlenotesPerHour = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === "") {
        setNotesPerHour(value); // Update state if input is valid
        }
            };

        useEffect(() => {
            if (student) {
              // Only set case_v if it exists in student
              if (student.case) {
                setCase(student.case);
              }
              // Only set notesPerHour if it exists in student
              if (student.notes_per_hour) {
                setNotesPerHour(student.notes_per_hour);
              }
            }
          }, [student])

  // =====================Case==========================
          const handleCase = (e) => {
          setCase(e.target.value); // Update state when input changes
         };


   

   
  
  // ===================Validation===============================

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [SchoolNameError, setSchoolNameError] = useState('');
  const [HomeNameError, setHomeNameError] = useState('');
  const [DOEError, setDOEError] = useState('');
  const [GradeError, setGradeError] = useState('');
  const validateForm = () => {
    // Validate first name
    if (!first_name) {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }

    // Validate last name
    if (!last_name) {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }

    if (!school_name) {
      setSchoolNameError('School name is required');
    } else {
      setSchoolNameError('');
    }

    if (!home_address) {
      setHomeNameError('Home name is required');
    } else {
      setHomeNameError('');
    }


    if (!doe_rate) {
      setDOEError('DOE Rate is required');
    } else {
      setDOEError('');
    }
    if (!grade) {
      setGradeError('Grade Rate is required');
    } else {
      setGradeError('');
    }
    if (!first_name || !last_name || !school_name || !home_address || !doe_rate || !grade) {
      return false;
    }
    
    return true;
  };

  // const [message, setMessage] = useState('');

    // ===================================================================
   
  
    const handleAddStudent   = async (event) => {
      console.log("handleAddStudent triggered");
      // event.preventDefault();
      // if (!validateForm()) return; 

     
      const formData = {
        first_name,
        last_name,
        grade,
        school_name,
        home_address,
        doe_rate,
        iep_doc,
        disability,
        nyc_id,
        notesPerHour,
        case_v,
        resolutionInvoice,
        status ,
        parent_name,
        parent_email,
        parent_phnumber,
        parent_type,
        // Add formDataList here to send the dynamic fields
        services: formDataList, // This includes all the dynamically added service forms
      };
      // console.log('Form data:', formData);

      try {
        const response = await axios.post('/api/addstudent', JSON.stringify(formData), {
          headers: {
            'Content-Type': 'application/json',
          },
        });


       toast.success("Student successfully Updated!", {
        position: "top-right", 
        autoClose: 5000,
      });

      // Navigate to Students page after 5 seconds
      setTimeout(() => {
        navigate('/Students');
      }, 5000);

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

    // =============Detch Student Detials=========================

    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`/api/StudentDataFetchAsID/${id}`);
        const data = await response.json();
    
        if (data.student) {
          setStudent(data.student);
        }
        if (data.parent) {
          setParentData(data.parent);
        }
        if (data.StudentServices) {
          setStudentServices(data.StudentServices);
        }
    
        console.log(data); // For debugging
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    
    useEffect(() => {
      fetchStudentDetails();
    }, [id]); // Fetch when `id` changes
    
    // if (!student || !parentData || !StudentServices) {
    //   return <div>Loading...</div>; // Show loading until all data is fetched
    // }
    
  // ======================================================
    return (
    <div className="dashboard-container">
            <div className="row dashboard-list">
              <div className="heading-text personal-info-text">
                <h3 style={{ marginLeft: '15px' }}>Basic Information</h3>
                <div className="" id="" onClick={backtostudent}>
                <i className="fa fa-backward fc-back-icon" aria-hidden="true"></i>
                </div>
              </div>
            </div>

        <div className="row dashboard-list personal-profile">
            <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field widthcss">
                <label>First Name:</label>
                <input
                  type="text"  
                  name="firstName"
                  className="stu-pro-input-field"
                  placeholder="Enter First Name" value={first_name} onChange={handleFirstNameChange}/>
                  {firstNameError && <span>{firstNameError}</span>}
              </div>

              <div className="col-md-6 student-profile-field widthcss">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  className="stu-pro-input-field"
                  placeholder="Enter Last Name"  value={last_name} onChange={handleLastNameChange}
                />
                {lastNameError && <span>{lastNameError}</span>}
              </div>
            </div>

          <div className="stu-pro-field-div">
              <div className="col-md-6 student-profile-field widthcss">
                <label>School Name:</label>
                <input
                  type="text"
                  name="schoolName"
                  className="stu-pro-input-field"
                  placeholder="Enter a School Name"  value={school_name} onChange={handleSchoolNameChange}
                />
                {SchoolNameError && <span>{SchoolNameError}</span>}
              </div>
            
            <div className="col-md-6 student-profile-field widthcss">
                <label>Grade:</label>
              <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {grade || "Choose Grade"}
                    </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("A")}>
                      A
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("AA")}>
                      AA
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("AB")}>
                      AB
                    </button>
                  </li>
                </ul>
              </div>
              {GradeError && <span>{GradeError}</span>}
          </div>
      </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>Home Address:</label>
              <textarea
                name="homeAddress"
                rows="6"
                cols="50"
                className="text-field stu-pro-input-field"
                placeholder="Enter home address"  value={home_address} onChange={handleHomeAddress}
              ></textarea>
              {HomeNameError && <span>{HomeNameError}</span>}
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>DOE Rate:</label>
              <input
                type="text"
                name="doeRate"
                className="stu-pro-input-field"
                placeholder="Enter Rate"  value={doe_rate} onChange={handelDoe_rate}
              />
              {DOEError && <span>{DOEError}</span>}
            </div>
          </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
                <label>Choose IEP:</label>
              <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {iep_doc || "Choose IEP Document"}
                    </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelIEP("A")}>
                      A
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelIEP("AA")}>
                      AA
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelIEP("AB")}>
                      AB
                    </button>
                  </li>
                </ul>
              </div>
            </div>

        

    
            <div className="col-md-6 student-profile-field widthcss">
                <label>Classification Disability:</label>
              <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {disability || "Choose"}
                    </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("A")}>
                      A
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("AA")}>
                      AA
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("AB")}>
                      AB
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
    

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>NYC ID:</label>
              <input
                type="text"
                name="nycId"
                className="stu-pro-input-field"
                placeholder="Enter NYC ID"  value={nyc_id} onChange={handelNycID}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Case:</label>
              <input
                type="text"
                name="case"
                className="stu-pro-input-field"
                placeholder="Enter Case"  value={case_v} onChange={handleCase}
              />
            </div>
          </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>No Notes Per Hr:</label>
              <input
                type="text"
                name="notesPerHour"
                className="stu-pro-input-field"
                placeholder="Enter No Notes Per Hr" value={notesPerHour} onChange={handlenotesPerHour}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Resolution Invoice:</label>
              <input
                type="checkbox"
                name="resolutionInvoice"
                checked={resolutionInvoice}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field widthcss">
            <label>Status:</label>
            <div className="radio-btn">
              <div className="radio">
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="inactive"
                  onChange={handleRadioChange}  
                  checked={status === 'inactive'} // Update onChange handler
                />
                <label>Inactive</label>
              </div>
              <div className="radio">
                <input
                  type="radio"
                  id="active"
                  name="status"
                  value="active"
                  onChange={handleRadioChange} 
                  checked={status === 'active'} // Update onChange handler
                />
                <label>Active</label>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="row dashboard-list">
          <div className="heading-text parent-info-text">
            <h3 style={{ marginLeft: '15px' }}>Parent Information</h3>
          </div>
        </div>

        <div className="row dashboard-list personal-profile">
          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>Parent Name:</label>
              <input
                type="text"
                name="parentName"
                className="stu-pro-input-field"
                placeholder="Enter Parent Name"  value={parent_name} onChange={handleParentname}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Parent Email:</label>
              <input
                type="text"
                name="parentEmail"
                className="stu-pro-input-field"
                placeholder="Enter Parent E-mail"   value={parent_email} onChange={handleParentEmail}
              />
            </div>
          </div>

          <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field widthcss">
                <label>Parent Type:</label>
              <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {parent_type || "Choose Parent Type"}
                    </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleParentTypeChange("Male")}>
                      Male
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleParentTypeChange("Fe-Male")}>
                      Fe-Male
                    </button>
                  </li>
                
                </ul>
              </div>
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Phone No:</label>
              <input
                type="text"
                name="phoneNumber"
                className="stu-pro-input-field"
                placeholder="Enter parent phone no." value={parent_phnumber} onChange={handleParentPHnumber}
              />
            </div>
          </div>
        </div>
        {/* --------------------------------Services---------------------------------- */}
          <div className="row dashboard-list personal-profile">
            
            {formDataList.map((formData, index) => (
              <div key={index} id="profileContainer" className="stu-profile-div">
                
                <div className="stu-pro-field-div">
                  
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-1rem', marginTop: '-7rem' }}>
                  <Tooltip title= "Remove Service"  arrow>
                    <IconButton
                      onClick={() => removeService(index)}
                      style={{
                        background: 'none',
                        padding: '0',
                        cursor: 'pointer',
                        cursor: formDataList.length > 1 || index === formDataList.length - 1 ? 'pointer' : 'allowed',
                      }}
                       disabled={formDataList.length <= 1 && index === formDataList.length - 1}
                    >
                      <FontAwesomeIcon icon={faSquareMinus} />
                    </IconButton>
                  </Tooltip>
                </div>
                    
                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Service Type:</label>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {formData.service_type || "Choose Service Type"}
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "Service A")}>
                            Service A
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "Service B")}>
                            Servive B
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                    <div className="col-md-6 student-profile-field widthcss">
                        <label>Start Date:</label>
                        <DatePicker
                            className=""
                            value={formData.startDate ? new Date(formData.startDate) : null}  // Convert string to Date object
                            placeholder="Enter Start Date"
                            onChange={(value) => handleInputChange(index, 'startDate', value)}  // Handle Date object change
                            style={{ width: '100%' }}  // Optional: Set width to match the input field's size
                        />
                    </div>



                  {/* -------Delete Button of services----------- */}
                  
                {/* ----End---Delete Button of services----------- */}
                </div>
                
                <div className="stu-pro-field-div">
                    <div className="col-md-6 student-profile-field widthcss">
                        <label>End Date:</label>
                        <DatePicker
                            className=""
                            value={formData.endDate ? new Date(formData.endDate) : null}  // Convert string to Date object if needed
                            placeholder="Enter End Date"
                            onChange={(value) => handleInputChange(index, 'endDate', value)}  // Handle Date object change
                            style={{ width: '100%', height: '45px' }}  // Optional: Set height and width
                        />
                    </div>


                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Weekly Mandate:</label>
                    <input
                      type="text"
                      name="weeklyMandate"
                      className="stu-pro-input-field"
                      value={formData.weeklyMandate}
                      placeholder="Enter Weekly Mandate"
                      onChange={(e) => handleInputChange(index, 'weeklyMandate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="stu-pro-field-div">
                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Yearly Mandate:</label>
                    <input
                      type="text"
                      name="yearlyMandate"
                      className="stu-pro-input-field"
                      value={formData.yearlyMandate}
                      placeholder="Enter yearly mandate"
                      onChange={(e) => handleInputChange(index, 'yearlyMandate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div>
              <button id="addServiceBtn" className="add-service-btn" onClick={addService}>Add Service</button>
            </div>
          </div>

        {/* ----------------------End of Add Service ----------- */}
      <div>
      <button  type="button" id = "handleAddStudent" className="save-student-btn" onClick={handleAddStudent}>Save Student</button>
      <ToastContainer />
    </div>
  </div>
    );

    
  };

export default AddStudent;


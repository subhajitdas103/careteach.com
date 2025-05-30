import React, { useState , useEffect ,useRef } from 'react';
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./Students.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Tooltip } from '@mui/material';
import 'rsuite/styles/index.less'; // Import RSuite styles
import { DatePicker } from 'rsuite';
import { Modal as FlowbitModal } from 'flowbite-react';
import 'rsuite/Uploader/styles/index.css';
// import { useForm } from 'react-hook-form'; // Import useForm
// import { useForm } from "react-hook-form";
// import Dropdown from "react-bootstrap/Dropdown";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import React, { useState } from 'react';
import { Uploader , Button  , Row, Col} from 'rsuite';
  const AddStudent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
 
  // ============Getting Roll Name from Session=========
  const { userRollID, userRollName } = useAuth(); 
  console.log("Updated Roll Name:", userRollName);
  console.log("Updated Roll ID:", userRollID); 
  
  // ============Getting Roll Name from Session=========
  
  
  const navigate = useNavigate();

  //==============================================================
    const backtostudent = () => {
      navigate('/Students'); // Specify the path you want to navigate to
    };
  // ==========================Clone Service Div====================================
  const [formDataList, setFormDataList] = useState([
    { service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '' , isClone: false}
  ]);

  // Function to handle changes in form inputs (e.g., Start Date, End Date)
  const handleInputChange = (index, field, value) => {
    const updatedFormDataList = [...formDataList];
     if (field === "startDate" && new Date(value) > new Date(updatedFormDataList[index].endDate)) {
          // alert("Start date cannot be greater than end date!");
              toast.error("Start date cannot be greater than end date!");
          return;
        }
        if (field === "endDate" && new Date(value) < new Date(updatedFormDataList[index].startDate)) {
          // alert("End date cannot be before start date!");
          toast.error("End date cannot be before start date!");
          return;
        }   
        
        if (field === "weeklyMandate") {
          // Convert both to numbers for comparison
          const weeklyHours = parseFloat(value); // New weekly mandate value
          const yearlyHours = parseFloat(updatedFormDataList[index].yearlyMandate); // Existing yearly mandate value
      
          // Ensure that the weekly mandate multiplied by 52 (weeks in a year) is not greater than the yearly mandate
          const calculatedYearlyHours = weeklyHours * 52;
      
          // if (calculatedYearlyHours > yearlyHours) {
          //     toast.error("Weekly Mandate exceeds the Yearly Mandate!");
          //     return;
          // }
      }
      
    updatedFormDataList[index][field] = value;
    setFormDataList(updatedFormDataList);
  };

  const handleServiceTypeChange = (index, type) => {
    // ------When Add Student , Andif Service type Choose two times show error------
    const isTypeAlreadySelected = formDataList.some((service, i) => 
      service.service_type === type && i !== index
    );
    
    if (isTypeAlreadySelected) {
      toast.error(`${type} has already been selected. You cannot select it again.`);
      return;
    }


    const updatedFormDataList = [...formDataList];
    updatedFormDataList[index] = {
      ...updatedFormDataList[index], // Preserve the other fields
      service_type: type,            // Update the service_type value
    };
    setFormDataList(updatedFormDataList);
  };

  // // Function to add a new service (clone the form)
  // const addService = () => {
  //   setFormDataList([
  //     ...formDataList,
  //     { service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '' ,  isClone: true}
  //   ]);
  // };
  const addService = () => {
    setFormDataList((prevList) => [
      ...(prevList || []),
      {
        service_type: '',
        startDate: new Date().toISOString(), // ISO format
        endDate: new Date().toISOString(), // ISO format
        weeklyMandate: '',
        yearlyMandate: '',
        isClone: true
      }
    ]);
  };
  
  // Function to remove a service (form)
const removeService = (index) => {
  const updatedFormDataList = formDataList.filter((_, i) => i !== index);
  setFormDataList(updatedFormDataList);
};
  // ===================================================================
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [resolutionInvoice, setResolutionInvoice] = useState(false);

  const handleCheckboxChange = (e) => {
    setResolutionInvoice(e.target.checked);
  };
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedSchoolID, setSelectedSchoolID] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [grade, setGrade] = useState('');
    const [school_name, setSchoolName] = useState('');
    const [home_address, setHomeaddress] = useState('');
    const [doe_rate, setDOE] = useState('');
    const [iep_doc, setIEP] = useState('');
    const [disability, setDisability] = useState('');
    const [nyc_id, setNYC] = useState('');
    const [notesPerHour, setNotesPerHour] = useState('');
    const [case_v, setCase] = useState('');
    const [status, setStatus] = useState("active");  // Set 'active' as the default value
    const resolutionInvoiceValue = resolutionInvoice ? 'yes' : 'no';


    // ------------------Parent---------
    const [parent_name, setParent] = useState('');
    const [parent_email, setParentEmail] = useState('');
    const [parent_type, setParentType] = useState('');
    const [parent_phnumber, setParentPH] = useState('');
  // ---------------------Parent END------------------------

     
    // Handle Upload Success
    const uploaderRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const handleUploadSuccess = async (response) => {
      console.log("Upload success:", response);
    
      if (response.fileName) {
        if (iep_doc) {
          await deletePreviousFile(iep_doc);
        }
        setIEP(response.fileName); // Store uploaded file path in state
        toast.success("File uploaded successfully!");
      } else {
        toast.error("File upload failed!");
      }
    };
    

    const deletePreviousFile = async (fileName) => {
      try {
      
        const response = await fetch(`${backendUrl}/api/delete_iep_upload_file/${fileName}`, {
          method: "DELETE",
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log("Previous file deleted:", data.message);
        } else {
          console.error("Error deleting file:", data.message);
        }
      } catch (error) {
        console.error("Error in delete request:", error);
      }
    };

    // ----------------------------------------
    
    const handleUploadError = async (errorResponse) => {
      try {
          const response = await errorResponse.json(); // Parse JSON response
          if (response.message) {
              toast.error(response.message); // Show Laravel error message in toast
          } else {
              toast.error("File upload failed!"); // Default error message
          }
      } catch (err) {
          toast.error("An unexpected error occurred!");
      }
  };
  
    const handleParentname = (event) => {
      setParent(event.target.value);
    };


    const handleParentEmail = (event) => {
      setParentEmail(event.target.value);
    };

    const handleParentPHnumber = (event) => {
      setParentPH(event.target.value);
    };


    
  const handleParentTypeChange = (selectedParent) => {
    setParentType(selectedParent);
  };


    const handleRadioChange = (event) => {
      setStatus(event.target.value);
    };
    

    const handleFirstNameChange = (e) => {
      setFirstName(e.target.value);
    
    };

    const handleLastNameChange = (event) => {
      setLastName(event.target.value);
     
    };
   
    const handleHomeAddress = (event) => {
      setHomeaddress(event.target.value);
      
    };

    const handelDoe_rate = (event) => {
    const value = event.target.value;
    if (/^\d+$/.test(value) || value === "") {
      setDOE(value); 
    }

    if (event.target.value) {
    }
  };

    const handelNycID = (event) => {
      const value = event.target.value;
    if (/^\d+$/.test(value) || value === "") {
      setNYC(value);
    }
    };
    const handlenotesPerHour = (event) => {
      const value = event.target.value;
  if (/^\d+$/.test(value) || value === "") {
    setNotesPerHour(value);
  }
    };
    const handleCase = (event) => {
      setCase(event.target.value);
    };
    const handleGradeChange = (selectedGrade) => {
      setGrade(selectedGrade);
    };

    const handelDisability = (selectedDisability) => {
      setDisability(selectedDisability);
      
    };


//  ========================Fetch school Data==========================
  const [schools, setSchools] = useState([]);
 const fetchSchoolDetails = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/fetchSchoolData`);
    const data = await response.json();
    setSchools(data); // Update the state with fetched data
    console.log(data);
  } catch (error) {
    console.error('Error fetching school details:', error);
  }
};
 useEffect(() => {
    fetchSchoolDetails();
  }, []);
console.log(schools);
// ===========================================================

 const handleSchoolChange = (schoolName , id) => {
  console.log("Selected School ID:", id);
  // console.log("Selected School Name:", name);
  setSelectedSchool(schoolName);
  setSelectedSchoolID(id);
  console.log('Selected school:', schoolName); 
};
    // ===================================================================
   
    const handleSchoolNameChange = (event) => {
      setSchoolName(event.target.value);
    
    };

    const handleAddStudent = async (event) => {
      console.log("handleAddStudent triggered");
    
      // Helper function for validation
      const validateField = (field, message) => {
        if (!field) {
          toast.error(message);
          return false;
        }
        return true;
      };
    
      if (
        !validateField(first_name, 'Please fill First Name!') ||
        !validateField(last_name, 'Please fill Last Name!') ||
        !validateField(grade, 'Please Choose Grade!') ||
        !validateField(home_address, 'Please fill Home address!') ||
        !validateField(doe_rate, 'Please Enter DOE Rate!') ||
        // !validateField(iep_doc, 'Please Choose IEP!') ||
        !validateField(disability, 'Please Choose Disability!') ||
        !validateField(nyc_id, 'Please Enter NYC ID!') ||
        !validateField(parent_name, 'Please Enter Parent Name!') ||
        !validateField(selectedSchool, 'Please Choose School!') ||
        !validateField(parent_type, 'Please Choose Parent Type!')
      ) {
        return;
      }
    
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(parent_email)) {
        toast.error('Enter a valid email!');
        return;
      }
    
      const cleanNumber = parent_phnumber.replace(/\s/g, '').trim(); // Remove spaces and trim

      if (cleanNumber && !/^\d{10}$/.test(cleanNumber)) { 
        toast.error('Phone number must be 10 digits!');
        return;
      }
 
    

      const formData = {
        first_name,
        last_name,
        grade,
        school_name: selectedSchool,
        home_address,
        doe_rate,
        iep_doc,
        disability,
        nyc_id,
        notesPerHour,
        case_v,
        resolutionInvoice,
        status,
        parent_name,
        parent_email,
        parent_phnumber,
        parent_type,
        services: formDataList,
        userRollID,
        selectedSchoolID,
      };
      try {
        const response = await axios.post(`${backendUrl}/api/addstudent`, JSON.stringify(formData), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        setTimeout(() => {
          toast.success("Student Created successfully", {
            position: "top-right",
            autoClose: 5000,
          });
        }, 500);
    
        navigate('/Students', { state: { successMessage: 'Student Created successfully!' } });
      } catch (error) {
    if (error.response && error.response.data.error) {
        toast.error(error.response.data.error, {
            position: "top-right",
            autoClose: 5000,
        });
    } else if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        for (const [key, value] of Object.entries(errors)) {
            toast.error(value[0], {
                position: "top-right",
                autoClose: 5000,
            });
            break;
        }
    } else {
        toast.error('An error occurred. Please try again later.', {
            position: "top-right",
            autoClose: 5000,
        });
    }
}
    };
    
// ==============================


  
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
                <label>First Name*</label>
                <input
                  type="text"  
                  name="firstName"
                  className="stu-pro-input-field"
                  placeholder="Enter First Name" value={first_name} onChange={handleFirstNameChange}/>
               
              </div>

              <div className="col-md-6 student-profile-field widthcss">
                <label>Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  className="stu-pro-input-field"
                  placeholder="Enter Last Name"  value={last_name} onChange={handleLastNameChange}
                />
              </div>
            </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>School Name:</label>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  {selectedSchool || "Choose School"} {/* Display selected school or default text */}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {schools.length > 0 ? (
                    schools.map((school) => (
                      <li key={school.id}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleSchoolChange(school.school_name , school.id,)}>
                          {school.school_name} {/* Ensure this is a string */}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li><span className="dropdown-item">No schools available</span></li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="col-md-6 student-profile-field widthcss">
                <label>Grade*</label>
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
                      onClick={() => handleGradeChange("K")}>
                      K
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("1")}>
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("2")}>
                      2
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("3")}>
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("4")}>
                      4
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("5")}>
                      5
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("6")}>
                      6
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("7")}>
                      7
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("8")}>
                      8
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("9")}>
                      9
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("10")}>
                      10
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("11")}>
                      11
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGradeChange("12")}>
                      12
                    </button>
                  </li>
                </ul>
              </div>
          </div>
      </div>

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>Home Address*</label>
              <textarea
                name="homeAddress"
                rows="6"
                cols="50"
                className="text-field stu-pro-input-field"
                placeholder="Enter home address"  value={home_address} onChange={handleHomeAddress}
              ></textarea>
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>DOE Rate*</label>
              <input
                type="text"
                name="doeRate"
                className="stu-pro-input-field"
                placeholder="Enter Rate"  value={doe_rate} onChange={handelDoe_rate}
              />
            </div>
          </div>

          <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field widthcss">
            <label>Upload IEP Document*</label>
            <div className="dropdown" style={{ padding: '20px' }}>
               <Row>
                  {/* Responsive layout */}
                  <Col xs={24} sm={12} md={8}>
                  <Uploader
                  ref={uploaderRef}
                  action={`${backendUrl}/api/upload_iep_doc`}
                  autoUpload={true}
                  name="iep_doc" // Ensure the field name matches Laravel's expectation
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  multiple={false} 
                  fileList={fileList}// Ensure only one file can be uploaded
                  onChange={(newFileList) => setFileList(newFileList.slice(-1))} 
                  // disabled={true}
                  >
                  <Button>Select IEP Document</Button>
                  </Uploader>
                  </Col>
                </Row>
              </div>
            </div>
    
            <div className="col-md-6 student-profile-field widthcss">
                <label>Classification Disability*</label>
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
                      onClick={() => handelDisability("Autism")}>
                      Autism
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Deafness")}>
                      Deafness
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Deaf-Blindness")}>
                      Deaf-Blindness
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Emotional-disturbance")}>
                      Emotional-disturbance
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Hearring Impairment")}>
                      Hearring Impairment
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Intellectual disability")}>
                      Intellectual disability
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Learning disability")}>
                      Learning disability
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Multiple disabilities")}>
                      Multiple disabilities
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Orthopedic impairment")}>
                      Orthopedic impairment
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Other health-impairment")}>
                      Other health-impairment
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Speech or language impairment")}>
                      Speech or language impairment
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Traumatic brain injury")}>
                      Traumatic brain injury
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Visual impairment")}>
                      Visual impairment
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Preschool Student with a Disability")}>
                      Preschool Student with a Disability
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handelDisability("Other")}>
                      Other
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
    

          <div className="stu-pro-field-div">
            <div className="col-md-6 student-profile-field widthcss">
              <label>NYC ID*</label>
              <input
                type="text"
                name="nycId"
                className="stu-pro-input-field"
                placeholder="Enter NYC ID"  value={nyc_id} onChange={handelNycID}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Case*</label>
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
              <label>No. of Notes Per Hour.*</label>
              <input
                type="text"
                name="notesPerHour"
                className="stu-pro-input-field"
                placeholder="Enter No. of  Notes Per Hour" value={notesPerHour} onChange={handlenotesPerHour}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Resolution Invoice:</label>
              <input
                type="checkbox"
                name="resolutionInvoice"
                checked={resolutionInvoice}
                onChange={handleCheckboxChange}
                style={{ height: "20px", width: "20px" }}
              />
            </div>
          </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field widthcss">
            <label>Status:</label>
            <div className="radio-btn statusinaddstaudent">
              <div className="radio">
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="inactive"
                  onChange={handleRadioChange}  // Update onChange handler
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
              <label>Parent Name*</label>
              <input
                type="text"
                name="parentName"
                className="stu-pro-input-field"
                placeholder="Enter Parent Name"  value={parent_name} onChange={handleParentname}
              />
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Parent Email*</label>
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
                <label>Parent Type*</label>
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
                      onClick={() => handleParentTypeChange("Female")}>
                      Female
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 student-profile-field widthcss">
              <label>Phone No. :</label>
              <input
                type="text"
                maxLength="12" 
                name="phoneNumber"
                className="stu-pro-input-field"
                placeholder="Enter Parent Phone No." value={parent_phnumber} onChange={handleParentPHnumber}
              />
            </div>
          </div>
        </div>
        {/* --------------------------------Services---------------------------------- */}
          <div className="row dashboard-list personal-profile">
            {formDataList.map((formData, index) => (
              <div key={index} id="profileContainer" className="stu-profile-div">
                <div className="stu-pro-field-div">
                {  formData.isClone && (
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-1rem', marginTop: '-7rem' }}>
                      <Tooltip title="Remove Service" arrow>
                        <IconButton
                          onClick={() => removeService(index)} // Call removeService when clicked
                          style={{
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                          }}
                        >
                          <FontAwesomeIcon icon={faSquareMinus} />
                        </IconButton>
                      </Tooltip>
                    </div>
                    )
                  }
                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Service Type*</label>
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
                            onClick={() => handleServiceTypeChange(index, "SEIT")}>
                            SEIT
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "SETSS")}>
                            SETSS
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "PT")}>
                            PT
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "OT")}>
                            OT
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "SPEECH")}>
                            SPEECH
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "HEALTH PARA")}>
                            HEALTH PARA
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "COUNSELING")}>
                            COUNSELING
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Start Date*</label>
                    <DatePicker
                      className=""
                      // value={formData.startDate}
                      value={formData.startDate ? new Date(formData.startDate) : null} // Ensure the value is a Date object
                      format="MM/dd/yyyy" 
                      placeholder="Enter Start Date"
                      onChange={(value) => {
                        const formattedStartDate = value ? value.toLocaleDateString("en-CA") : null;
                         handleInputChange(index, 'startDate', formattedStartDate)}}
                      style={{ width: '100%'}}  // Optional: Set width to match the input field's size
                    />
                  </div>
                </div>
                
                <div className="stu-pro-field-div">
                  <div className="col-md-6 student-profile-field widthcss">
                    <label>End Date*</label>
                    <DatePicker
                      className=""
                      value={formData.endDate ? new Date(formData.endDate) : null} 
                      // value={formData.endDate}
                      format="MM/dd/yyyy"
                      placeholder="Enter End Date"
                      onChange={(value) => {
                        const formattedEndDate = value ? value.toLocaleDateString("en-CA") : null;
                        handleInputChange(index, 'endDate', formattedEndDate)}}
                      style={{ width: '100%', height: '45px' }}  // Added height and width
                    />
                  </div>

                  <div className="col-md-6 student-profile-field widthcss">
                    <label>Weekly Mandate*</label>
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
                    <label>Yearly Mandate*</label>
                    <input
                      type="text"
                      name="yearlyMandate"
                      className="stu-pro-input-field"
                      value={formData.yearlyMandate}
                      placeholder="Enter Yearly Mandate"
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


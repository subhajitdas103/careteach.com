import React, { useState , useEffect , useRef } from 'react';
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
// import "react-loading-skeleton/dist/skeleton.css";
// import Skeleton from "react-loading-skeleton";
import { PropagateLoader } from "react-spinners";
// import logo from "../assets/logo.png"; 
import logo from "../../Assets/logo.png"; 
// import React, { useState } from 'react';
import { Uploader , Button } from 'rsuite';
  const AddStudent = () => {
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    // console.log(id);
    const [student, setStudent] = useState(null);
    const [parent, setParentData] = useState(null);
    const [StudentServices, setStudentServices] = useState(null);

    const selectedServices = StudentServices?.map(service => service.service_type) || [];

  const navigate = useNavigate();

  //==============================================================
    const backtostudent = () => {
      navigate('/Students'); 
    };
   

//-----------Start-----------Fetch  AssgniedProvider data------------
const [assignedProviders, setAssignedProviders] = useState([]);
const [AssignProviderID, setAssignProviderID] = useState(null);
const fetchAssignedProviderDetails = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/FetchAssignedProviders/${id}`);
      const data = await response.json();
      setAssignedProviders(data);
    
      console.log("API Response Assigned:", data);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    }
  };
  
  useEffect(() => {
    fetchAssignedProviderDetails();
  }, [id]);
// ======================================================================================


  // ==========================Clone Service Div====================================

  const [formDataList, setFormDataList] = useState([
    { id: '',service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: ''}
  ]);
  useEffect(() => {
    if (StudentServices && StudentServices.length > 0) {
      const updatedFormDataList = StudentServices.map(service => ({
        id: service.id || '',
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

  //   if (field === "weeklyMandate") {
  //     const currentValue = (updatedFormDataList[index].weeklyMandate);
  //     const newValue = value === "" ? null : (value); // Allow clearing

  //     if ( currentValue>newValue) {
  //         toast.error("Weekly Mandate cannot be decreased!");
  //         return;
  //     }
  // }

    updatedFormDataList[index][field] = value;
    setFormDataList(updatedFormDataList);

  };

 console.log("assignedProviders",assignedProviders);
  const handleServiceTypeChange = (index, type) => {

    const isTypeAlreadySelected = formDataList.some((service, i) => 
      service.service_type === type && i !== index
    );
    
    if (isTypeAlreadySelected) {
      toast.error(`${type} has already been selected. You cannot select it again.`);
      return;
    }

    const updatedFormDataList = [...formDataList];
    updatedFormDataList[index] = {
      ...updatedFormDataList[index],
      service_type: type,
    };
    setFormDataList(updatedFormDataList);
  };

  // const addService = () => {
  //   setFormDataList([
  //     ...formDataList,
  //     { id:'', service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '', isCloned: true}
  //   ]);
  // };


  const addService = () => {

    const lastService = formDataList[formDataList.length - 1];
  
    // Check if all required fields are filled (ensure numbers like 0 are allowed)
    if (
      lastService &&
      (!lastService.service_type ||
        !lastService.startDate ||
        !lastService.endDate ||
        lastService.weeklyMandate === "" ||  // Ensure empty string is blocked, but allow 0
        lastService.yearlyMandate === "")
    ) {
      toast.error("Please complete the current service before adding a new one.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
  
    // Add new service if validation passes
    setFormDataList([
      ...formDataList,
      { id: '', service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '', isCloned: true }
    ]);
  };
  
  // const addService = () => {
   
  
  //   // Add new service if validation passes
  //   setFormDataList([
  //     ...formDataList,
  //     { id: '', service_type: '', startDate: '', endDate: '', weeklyMandate: '', yearlyMandate: '', isCloned: true }
  //   ]);
  // };
  

  const removeService = (id) => {
    if(!id) {
      setFormDataList((prevFormDataList) =>
        prevFormDataList?.filter((service) => service.id !== id)
    );
    setStudentServices((prevServices) =>
        prevServices?.filter((service) => service.id !== id)
    );
    return;
  }
    console.log("Attempting to delete service with ID:", id);

    axios.delete(`${backendUrl}/api/DeleteStudentService/${id}`)
        .then((response) => {
            console.log('Service deleted successfully:', response.data);

            // Remove deleted service from state
            setFormDataList((prevFormDataList) =>
                prevFormDataList.filter((service) => service.id !== id)
            );
            setStudentServices((prevServices) =>
                prevServices.filter((service) => service.id !== id)
            );

            // Show success toast
            toast.success("Service successfully deleted!", {
                position: "top-right",
                autoClose: 5000,
            });
        })
        .catch((error) => {
            if (error.response) {
              if (
                error.response.status === 404 &&
                (error.response.data.message.includes("The route api/DeleteStudentService could not be found") ||
                 error.response.data.message.includes("An unexpected error occurred."))
            ) {
                return; 
            }
                console.error('Error deleting service (response):', error.response);

                // Show API error message in toast
                toast.error(error.response.data.message || "Failed to delete service.", {
                    position: "top-right",
                    autoClose: 5000,
                });

            }
            
      
            
            else {
                console.error('Error deleting service (message):', error.message);
                toast.error("An unexpected error occurred.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        });
};

  // ===================================================================

  const [resolutionInvoice, setResolutionInvoice] = useState(false);

  const handleCheckboxChange = (e) => {
    setResolutionInvoice(e.target.checked);
  };
    
    const [first_name, setFirstName] = useState(student?.first_name || '');

    const [last_name, setLastName] = useState(student?.last_name || '');
    const [grade, setGrade] = useState("");
    // const [school_name, setSchoolName] = useState(student?.school_name || '');
    const [selectedSchool, setSelectedSchool] = useState(student?.school_name || "");
    const [selectedSchoolID, setSelectedSchoolID] = useState(student?.id|| "");

    useEffect(() => {
      setSelectedSchool(student?.school_name || "");
      setSelectedSchoolID(student?.id || "");
    }, [student]);
    
    const [home_address, setHomeaddress] = useState(student?.home_address || '');
    const [doe_rate, setDOE] = useState(student?.doe_rate || '');
    const [DOEError, setDOEError] = useState("");
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

  // --------------------IEP doc upload-------------------------------
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const uploaderRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
  console.log("Updated IEP:", iep_doc);
  }, [iep_doc]);  // Logs whenever `iep_doc` updates
  

  const handleUploadError = (error) => {
    console.error("Upload failed:", error);
  }

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


   // Fetch file from database
   useEffect(() => {
    axios.get(`${backendUrl}/api/get_iep/${id}`)
      .then((response) => {
        setFileName(response.data.file_name);
        setFileUrl(response.data.file_url);
        console.log("response",response);
        // setFileType(response.data.file_type);
      })
      .catch(() => {
        console.log("No file found for this student.");
      });
  }, [backendUrl, id]);
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


   

   

    // ===================================================================
   
  
    const handleAddStudent   = async (event) => {
      console.log("Edit Student triggered");
      // event.preventDefault();
      // if (!validateForm()) return; 
 if (!first_name) {
        toast.error('Please fill First Name!');
        return;
    } else if (!last_name) {
        toast.error('Please fill Last Name!');
        return;
    } else if (!grade) {
        toast.error('Please Choose Grade!');
        return;
    }else if (!home_address) {
      toast.error('Please fill Home address!');
      return;
    }else if (!doe_rate) {
        toast.error('Please Enter DOE Rate!');
        return;
    
    }else if (!disability) {
      toast.error('Please Choose Disability!');
      return;
    }else if (!nyc_id) {
      toast.error('Please Enter NYC ID!');
      return;
    }else if (!parent_name) {
      toast.error('Please Enter Parent Name!');
      return;
    }else if (!parent_email) {
      toast.error('Please Enter Parent Email!');
      return;
    }
     
      const formData = {
        first_name,
        last_name,
        grade,
        selectedSchool,
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
        selectedSchoolID,
        // Add formDataList here to send the dynamic fields
        services: formDataList, // This includes all the dynamically added service forms
      };
      console.log('Form data:', formData);

      try {
        const response = await axios.post(`${backendUrl}/api/EditStudent/${id}`, formData, {
         
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setTimeout(() => {
                toast.success("Student Update successfully", {
                  position: "top-right",
                  autoClose: 5000,
                });
              }, 500);
     
        navigate('/Students', { state: { successMessage: 'Student updated successfully!' } });
              
     

        console.log('Data sent successfully:', response.data);  
      } catch (error) {
        // Check if the error is a validation or custom error (like the weekly mandate issue)
        if (error.response && error.response.data.error) {
            // Show custom error (e.g., Weekly Mandate cannot exceed Yearly Mandate)
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 5000,
            });
        } else if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            for (const [key, value] of Object.entries(errors)) {
                toast.error(value[0], {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } else {
            // Handle other types of errors (network, server, etc.)
            toast.error("An error occurred. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
            console.error('There was an error sending data:', error.response?.data || error.message);
        }
    }
  }
    
    
    
    // =============Detch Student Detials=========================

    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/StudentDataFetchAsID/${id}`);
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
      finally {
        setLoading(false); // Hide loader after the fetch completes
      }
    };
    
    useEffect(() => {
      fetchStudentDetails();
    }, [id]); // Fetch when `id` changes
    
   
  // ======================================================


   const [schools, setSchools] = useState([]);
   const fetchSchoolDetails = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/fetchSchoolData`);
      const data = await response.json();
      setSchools(data); 
      // setSelectedSchool(data[0].school_name);// Update the state with fetched data
      console.log(data);
    } catch (error) {
      console.error('Error fetching school details:', error);
    }
  };
   useEffect(() => {
      fetchSchoolDetails();
    }, []);
  console.log("hhhhhhhh",schools);
  // ===========================================================
  
   const handleSchoolChange = (schoolName , id) => {
    setSelectedSchool(schoolName);
    setSelectedSchoolID(id);
    console.log('Selected school:', id); 
  };

    return (
    <div className="dashboard-container">
        {loading ? (
        <div className="loader-container">
          <div className="loader-content">
            <img src={logo} alt="Loading..." className="logo-loader" />
            <PropagateLoader color="#3498db" size={10} />
          </div>
        </div>
          ) : (
          <>
            <div className="row dashboard-list">
              <div className="heading-text personal-info-text">
                <h2 style={{ marginLeft: '15px' ,marginTop: "-44px" }}>Edit Student</h2>
                {/* <h3 style={{ marginTop: "-44px" }}>Students</h3> */}
                <div className="" id="" onClick={backtostudent}>
                <i className="fa fa-backward fc-back-icon" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="personal-info-text">
            {/* <h3 style={{ marginLeft: '29px', color:'#4979a0'}}>Basic Information</h3> */}
            <h3 style={{ marginTop: "-44px" ,color:'#4979a0',marginLeft: '29px',marginTop: "-23px"  }}>Students</h3>
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
              <label>School Name*</label>
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
                  schools.map((school) => {
                    console.log("Rendering school:", school.school_name); // Debugging
                    return (
                      <li key={school.id}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleSchoolChange(school.school_name , school.id)}
                        >
                          {school.school_name}
                        </button>
                      </li>
                    );
                  })
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
                    <div className="dropdown">
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
                    {fileName && fileUrl && (
                      <div style={{ marginTop: "10px" }}>
                        <strong>Uploaded File: </strong> {fileName} &nbsp;
                        {/* <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer">
                          Download
                      </a> */}
                      </div>
                      )}
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
              <label>No. of Notes Per Hour:</label>
              <input
                type="text"
                name="notesPerHour"
                className="stu-pro-input-field"
                placeholder="Enter No. Notes Per Hour" value={notesPerHour} onChange={handlenotesPerHour}
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
              <label>Phone No. :</label>
              <input
                type="text"
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
                  
                <div className="stu-service-div">
                  <Tooltip title= "Remove Service"  arrow>
                    <IconButton
                      onClick={() => removeService(formData.id)}
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
                        aria-expanded="false"
                        disabled={!formDataList[index]?.isCloned}
                        >
                        {formData.service_type || "Choose Service Type"}
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "SEIT")}
                            disabled={selectedServices.includes("SEIT")} 
                            >
                            SEIT
                            
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "SETSS")}
                            disabled={selectedServices.includes("SETSS")} 
                            >
                            SETSS
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "PT")}
                            disabled={selectedServices.includes("PT")} 
                            >
                            PT
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "OT")}
                            disabled={selectedServices.includes("OT")} 
                            >
                            OT
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "SPEECH")}
                            disabled={selectedServices.includes("SPEECH")} 
                            >
                            SPEECH
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "HEALTH PARA")}
                            disabled={selectedServices.includes("HEALTH PARA")} 
                            >
                            HEALTH PARA
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleServiceTypeChange(index, "COUNSELING")}
                            disabled={selectedServices.includes("COUNSELING")} 
                            >
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
                        value={formData.startDate ? new Date(formData.startDate) : null} 
                         // Convert string to Date object
                        placeholder="Enter Start Date"
                        onChange={(value) => {
                            const formattedStartDate = value ? value.toLocaleDateString("en-CA") : null;
                            handleInputChange(index, 'startDate', formattedStartDate);  // Handle Date object change
                        }}
                        style={{ width: '100%' }}  // Optional: Set width to match the input field's size
                        format="MM/dd/yyy"
                     />
                  </div>
                  {/* -------Delete Button of services----------- */}
                  
                {/* ----End---Delete Button of services----------- */}
                </div>
                
                <div className="stu-pro-field-div">
                    <div className="col-md-6 student-profile-field widthcss">
                        <label>End Date:*</label>
                        <DatePicker
                            className=""
                            value={formData.endDate ? new Date(formData.endDate) : null}  // Convert string to Date object if needed
                            placeholder="Enter End Date"
                            onChange={(value) => {
                              const formattedEndDate = value ? value.toLocaleDateString("en-CA") : null;
                              handleInputChange(index, 'endDate', formattedEndDate)}}  // Handle Date object change
                            style={{ width: '100%', height: '45px' }}  // Optional: Set height and width
                            format="MM/dd/yyy"
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
    </>
      )}
  </div>
    );

    
  };

export default AddStudent;


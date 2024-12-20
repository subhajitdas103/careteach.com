import React, { useState, useEffect } from "react"; 
import { Modal, Button } from "react-bootstrap";
import axios from "axios"; // Axios for making HTTP requests
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams
import editIcon from '../../Assets/edit-info.png';
import DeleteAssignProviderIcon from '../../Assets/delete_12319540.png';
import "./Students.css";
import { DatePicker } from 'rsuite';
import { toast , ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
const AssignProviders = () => {
    const { id } = useParams();
//   const [selectedStudentId, setSelectedStudentId] = useState(null);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [studentDetails, setStudentDetails] = useState(null);
  const [StudentServices, setStudentServices] = useState([]);
  const [parentsDetails, setParentsDetails] = useState(null);

  const [selectedAssignProvider, setSelectedAssignProvider] = useState("");
  const [inputRateAssignProvider, setInputRateAssignProvider] = useState("");
  const [selectedAssignProviderLocation, setSelectedAssignProviderLocation] = useState("");
  const [selectedAssignProviderService, setSelectedAssignProviderService] = useState("");
  const [inputWklyHoursAssignProvider, setinputWklyHoursAssignProvider] = useState("");
  const [inputYearlyHoursAssignProvider, setInputYearlyHoursAssignProvider] = useState("");
  const [assignProviderStartDate, setAssignProviderStartDate] = useState(null);
  const [assignProviderEndDate, setAssignProviderEndDate] = useState(null);






  
//   -------------------Fetch Student Details -----------------

  const fetchStudentDetails = async () => {
   
    // if (!selectedStudentId) return;
    try {
      const response = await fetch(`/api/StudentDataFetchAsID/${id}`);
      const data = await response.json();
      console.log("API Response:", data); 

      if (data.studentDetails) setStudentDetails(data.studentDetails);
      if (data.Parents) setParentsDetails(data.Parents);
      if (data.StudentServices) setStudentServices(data.StudentServices);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

//   ----------------Saved Assign Provider Data-----------------------

  const handelAssignProviderData = async () => {
    console.log("handleAssignProvider triggered");

    const formData = {
      id,
      selectedAssignProvider,
      inputRateAssignProvider,
      selectedAssignProviderLocation,
      selectedAssignProviderService,
      inputWklyHoursAssignProvider,
      inputYearlyHoursAssignProvider,
      assignProviderStartDate,
      assignProviderEndDate,
      
    };

    console.log('Form data of assign Provider Modal:', formData);

    try {
      const response = await axios.post('/api/AssignProvider', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsModalOpen(false);
      setTimeout(() => {
        toast.success("Provider assigned successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      }, 500);
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error('There was an error sending data:', error.response?.data || error.message);
    }
  };


//   =================Modal Open==================

//-----------Start-----------Fetch  AssgniedProvider data------------
const [assignedProviders, setAssignedProviders] = useState([]);
const [AssignProviderID, setAssignProviderID] = useState(null);
const fetchAssignedProviderDetails = async () => {
    try {
      const response = await fetch(`/api/FetchAssignedProviders/${id}`);
      const data = await response.json();
      setAssignedProviders(data); // Store the response in state
      console.log("API Response Assigned:", data);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    }
  };
  
  useEffect(() => {
    fetchAssignedProviderDetails();
  }, [id]);

 ;
  
//   -----------End------------------Fetch Assigned data to Show--------------------------------------
  
//   const handelChangeProvider = (event) => {
//     setSelectedProvider(event.target.value);
//     console.log("Selected Provider:", event.target.value);
//   };
  
  const [ProviderDataAssignProvider, setProviderData] = useState(null);

  const fetchProviderData = async () => {
      try {
        const response = await fetch("/api/ViewProviders");
        const data = await response.json();
        console.log("API Response Provider Data:", data);
    
        // Directly check if 'data' is an array and has content
        if (Array.isArray(data) && data.length > 0) {
          setProviderData(data);  // Set the fetched data to the state
        } else {
          console.log("No providerData in response.");
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      }
    };
    
    useEffect(() => {
      fetchProviderData();
    }, []);
  //   -----------End------------------Fetch Provider data--------------------------------------
  
// ==============Back Button============
const navigate = useNavigate();
 const backToStudent = () => {
     navigate('/students');
   };


   const [show, setShow] = useState(false);
   const [selectedStudent, setSelectedStudent] = useState("");

   const AssignedProviderDelete = (id) => {
    setSelectedStudent(id); // You can also set more data about the student if needed
    setShow(true); // Opens the modal
    console.log("xxxxxxxx",id);
  };
  
  const handleClose = () => {
    setShow(false);  // Closes the modal
  };
// ==========Delete Assigned Providers================

const DeleteAssignBTN = () => {
  console.log("Attempting to delete provider with ID:", selectedStudent);

  axios.delete(`/api/DeleteAssignedProviders/${selectedStudent}`)
    .then((response) => {
      console.log('Provider deleted successfully:', response.data); // Log the actual response data

      setIsModalOpen(false);
    })
    .catch((error) => {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error deleting provider (response):', error.response);
       
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Error deleting provider (request):', error.request);
      } else {
        // Something else happened in setting up the request
        console.error('Error deleting provider (message):', error.message);
      }
    });
};


const [isModalOpen, setIsModalOpen] = useState(false);

// Function to open the modal
const openModal = () => setIsModalOpen(true);

// Function to close the modal
const closeModal = () => setIsModalOpen(false);


const [selectedProviderId, setSelectedProviderId] = useState(null);

const openModalAssignProvider = (id) => {
    setIsModalOpen(true); // Open the modal
    setSelectedProviderId(id); // Optionally store the ID for further use
};

  return (
<div>
    <ToastContainer />
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>Services and Provider</h3>
            <div onClick={backToStudent}>
                <i className="fa fa-backward fc-back-icon" aria-hidden="true" id="back_student_click"></i>
            </div>
         
        </div>
      </div>
      <div className="add-student-btn" onClick={() => openModalAssignProvider(id)}>
        <i className="fa fa-user-plus add-student-icon"></i> Assign a Provider
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-add-provider">
          <thead className="bg-red">
            <tr>
              <th>PROVIDER</th>
              <th>SERVICE TYPE</th>
              <th>WEEKLY HRS</th>
              <th>YEARLY HRS</th>
              <th>START DATE</th>
              <th>END DATE</th>
              <th>LOCATION</th>
              <th>RATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
                <tbody>
                 {assignedProviders.length > 0 ? (
                    assignedProviders.map((provider, index) => (
                    <tr key={index}>
                        <td>{provider.provider_name}</td>
                        <td>{provider.service_type}</td>
                        <td>{provider.wkly_hours}</td>
                        <td>{provider.yearly_hours}</td>
                        <td>{provider.start_date}</td>
                        <td>{provider.end_date}</td>
                        <td>{provider.location}</td>
                        <td>{provider.provider_rate}</td>
                        <td>
                        <div className="status-area">
                            <button
                            style={{ backgroundColor: 'white', display: 'inline-block' }}
                            title="Edit Assigned Provider"
                            >
                            <img src={editIcon} alt="Edit" style={{ width: '40px', marginRight: '5px' }} />
                            </button>

                            <button onClick={() => AssignedProviderDelete(provider.id)}
                            style={{ backgroundColor: 'white', display: 'inline-block' }}
                            title="Delete Assigned Provider"
                            >
                            <img src={DeleteAssignProviderIcon} alt="Delete" style={{ width: '40px', marginRight: '5px' }} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                    ) : (
                    <tr>
                    <td colSpan="9" className="text-center">No Providers Available</td>
                    </tr>
                    )}
                </tbody>

        </table>
      </div>

       {/* Modal for Assigning Provider */}
       {isModalOpen && (
        <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}>
        <Modal.Dialog>
          <Modal.Header closeButton onClick={closeModal}>
            <Modal.Title>Assign Provider</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <div className="form-row">
              <div className="col-12 col-md-12">
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
                <InputLabel id="provider-select-label">Select Provider</InputLabel>
                <Select
                    labelId="provider-select-label"
                    id="provider-select"
                    value={selectedAssignProvider}
                    onChange={(e) => setSelectedAssignProvider(e.target.value)}
                >
                    {ProviderDataAssignProvider.length > 0 ? (
                    ProviderDataAssignProvider.map((provider) => (
                        <MenuItem key={provider.id} value={`${provider.provider_first_name} ${provider.provider_last_name}`}>
                        {provider.provider_first_name} {provider.provider_last_name}
                        </MenuItem>
                    ))
                    ) : (
                    <MenuItem disabled>No Providers Available</MenuItem>
                    )}
                </Select>
                </FormControl>

              </div>
  
              <div className="col-12">
                <TextField
                  id="rate-input"
                  label="Rate"
                  variant="outlined"
                  fullWidth
                  value={inputRateAssignProvider}
                  onChange={(e) => setInputRateAssignProvider(e.target.value)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter rate"
                />
              </div>
  
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="location-select-label">Location</InputLabel>
                    <Select
                      labelId="location-select-label"
                      value={selectedAssignProviderLocation}
                      onChange={(e) => setSelectedAssignProviderLocation(e.target.value)}
                    >
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="School">School</MenuItem>
                    </Select>
                  </FormControl>
                </div>
  
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="service-select-label">Service Type</InputLabel>
                    <Select
                      labelId="service-select-label"
                      value={selectedAssignProviderService}
                      onChange={(e) => setSelectedAssignProviderService(e.target.value)}
                    >
                      {StudentServices.length > 0 ? (
                        StudentServices.map((service) => (
                          <MenuItem key={service.id} value={service.service_type}>
                            {service.service_type}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No services available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* ========================= */}
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                <TextField
                  id="weekly-input"
                  label="WeeklyHours"
                  variant="outlined"
                  fullWidth
                  value={inputWklyHoursAssignProvider}
                  onChange={(e) => setinputWklyHoursAssignProvider(e.target.value)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Weekly Hours"
                />
                </div>
  
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                <TextField
                  id="yearly-input"
                  label="Yearly Hours"
                  variant="outlined"
                  fullWidth
                  value={inputYearlyHoursAssignProvider}
                  onChange={(e) => setInputYearlyHoursAssignProvider(e.target.value)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Yearly Hours"
                />
                </div>
              </div>
              {/* ============== */}
  
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "4px" }}>
                  <DatePicker
                    selected={assignProviderStartDate}
                    onChange={(date) => setAssignProviderStartDate(date)}
                    placeholdertext="Select a start date"
                  />
                </div>
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <DatePicker
                    selected={assignProviderEndDate}
                    onChange={(date) => setAssignProviderEndDate(date)}
                    placeholdertext="Select an end date"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handelAssignProviderData}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
        </div>
      )}

        {/* =============Delete Assigned Provider================= */}
        {AssignedProviderDelete && (
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Assign Provider</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Are you sure you want to delete this Service {"Provider "}
                      <strong className="student-name-delete-modal">
                        
                      </strong>
                      ?
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="cancel-button" variant="secondary" onClick={handleClose}>
                      <i className="fa-sharp-duotone fa-solid fa-xmark"></i>
                    </Button>
                    <Button className="delete-button" variant="danger" onClick={DeleteAssignBTN}  >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
    </div>
</div>
  );
};

export default AssignProviders;

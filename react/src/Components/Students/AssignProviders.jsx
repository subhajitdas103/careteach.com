import React, { useState, useEffect } from "react"; 
import { Modal, Button } from "react-bootstrap";
import axios from "axios"; // Axios for making HTTP requests
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams
import editIcon from '../../Assets/edit-info.png';
import DeleteAssignProviderIcon from '../../Assets/delete_12319540.png';
import "./Students.css";
// import { DatePicker } from 'rsuite';
import { toast , ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; 
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
// import { DatePicker } from '@nextui-org/react';

// import { DatePicker } from "antd";
// import DatePicker from 'react-multi-date-picker';


// import 'antd/dist/antd.css'; 

import "react-datepicker/dist/react-datepicker.css"; 
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


  const resetFormData = () => {
    setSelectedAssignProvider(''); // Reset the selected provider
    setInputRateAssignProvider(''); // Reset the rate
    setSelectedAssignProviderService(''); // Reset service selection
    setSelectedAssignProviderLocation(''); // Reset location selection
    setinputWklyHoursAssignProvider(''); // Reset weekly hours
    setInputYearlyHoursAssignProvider(''); // Reset yearly hours
    setAssignProviderStartDate(null); // Reset start date
    setAssignProviderEndDate(null); // Reset end date
  };
// After Modal close of Assign provider , Reset all data in modal


  
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
  // Process the selectedAssignProvider to extract the first name
  const [providerId, full_name] = selectedAssignProvider.split('|');

  const FormatassignProviderStartDate = assignProviderStartDate ? new Date(assignProviderStartDate).toISOString().split('T')[0] : null;
  const FormatassignProviderEndDate = assignProviderEndDate ? new Date(assignProviderEndDate).toISOString().split('T')[0] : null;

  if (!selectedAssignProvider) {
          toast.error('Please Select a Provider!');
          return;
      }
  if (!inputRateAssignProvider) {
      toast.error('Please Enter Rate!');
      return;
  }

  if (!selectedAssignProviderService) {
    toast.error('Please Select a Service!');
    return;
  }
  if (!selectedAssignProviderLocation) {
    toast.error('Please Select a Location!');
    return;
  }
  if (!inputWklyHoursAssignProvider) {
    toast.error('Please Select a Weekly Hours!');
    return;
    }
  if (!inputYearlyHoursAssignProvider) {
  toast.error('Please Enter Yearly Hours!');
  return;
  }
  if (!assignProviderStartDate) {
  toast.error('Please Select a Start Date!');
  return;
  }
  if (!assignProviderEndDate) {
  toast.error('Please Select a End Date!');
  return;
  }
  


    const formData = {
      id,
      selectedProviderId,
      full_name,
      inputRateAssignProvider,
      selectedAssignProviderLocation,
      selectedAssignProviderService,
      inputWklyHoursAssignProvider,
      inputYearlyHoursAssignProvider,
      assignProviderStartDate : FormatassignProviderStartDate,
      assignProviderEndDate : FormatassignProviderEndDate ,
      
    };

    console.log('Form data of assign Provider Modal:', formData);

    try {
      const response = await axios.post('/api/AssignProvider', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      fetchAssignedProviderDetails();
     
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
const [selectedProviderName, setSelectedProviderName] = useState('');

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


  
//   -----------End-------,----------Fetch Assigned data to Show--------------------------------------
  

// ========================================

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
    // console.log("xxxxxxxx",id);
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
      fetchAssignedProviderDetails();
      setShow(false);
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
const [isModalOpenofEditAssignProvider, setIsModalOpenofAssignProvider] = useState(false);
const openModal = () => setIsModalOpen(true);

const closeModal = () => {
  setIsModalOpenofAssignProvider(false);
  resetFormData();
};

// =====================Edit of Assign Provider Modal==============================
// console.log("cccccccccc",assignedProviders);
// const AssignedProviderEdit = (id) => {
//   alert(id);
//   setIsModalOpenofAssignProvider(true)
      // console.log("xxxxxxxx",id);
//     };
    const closeModalofAssignProvider = () => {
      setIsModalOpenofAssignProvider(false);
     
    };
    
    const AssignedProviderEdit = (id) => {
      
      // Find the provider details by ID
      const providerDetails = assignedProviders.find((provider) => provider.id === id);
    // console.log("uegf",providerDetails.provider_name);
      if (providerDetails) {

       
        // const formattedStartDate = format(new Date(providerDetails.start_date), "dd/MM/yyyy");
        // const formattedEndDate = format(new Date(providerDetails.end_date), "dd/MM/yyyy");
  


       setSelectedAssignProvider(`${providerDetails.provider_id}|${providerDetails.provider_name}`);

        setInputRateAssignProvider(providerDetails.provider_rate);
        setSelectedAssignProviderLocation(providerDetails.location);
        // Set the formatted dates
      setAssignProviderStartDate(providerDetails.start_date);
      setAssignProviderEndDate(providerDetails.end_date);


        setinputWklyHoursAssignProvider(providerDetails.wkly_hours );
        setInputYearlyHoursAssignProvider(providerDetails.yearly_hours );
    
        // Open the modal
        setIsModalOpenofAssignProvider(true);
      } else {
        console.error("Provider not found for ID:", id);
        alert("Provider details not found!");
      }
    };
    console.log("strat date",assignProviderStartDate);
    
// ==================================================

const [selectedProviderId, setSelectedProviderId] = useState(null);

const openModalAssignProvider = (id, name) => {
  setIsModalOpen(true); // Open the modal
  setSelectedProviderId(id); // Set the selected provider ID
  // setSelectedAssignProvider(`${id}|${name}`); // Set the selected provider as `id|name`
};

console.log("nnnnnnnnn",selectedProviderId);


  console.log("cxxxx",selectedAssignProvider);

  useEffect(() => {
    console.log("Updated start date:", assignProviderStartDate); // Log the updated start date for debugging
  }, [assignProviderStartDate]);
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
                            <button onClick={() => AssignedProviderEdit(provider.id)}
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
                    
                    onChange={(e) => {
                      const [id, name] = e.target.value.split('|'); // Split the concatenated value
                      setSelectedAssignProvider(e.target.value);   // Update the full `id|name` in state
                      setSelectedProviderId(id);                   // Store the provider ID
                    }}
                    
                >
                    {ProviderDataAssignProvider.length > 0 ? (
                      ProviderDataAssignProvider.map((provider) => (
                        <MenuItem 
                          key={provider.id} 
                          value={`${provider.id}|${provider.provider_first_name} ${provider.provider_last_name}`}
                        >
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
                    className="datepicker_Date_of_assignProvider" 
                  />
                </div>
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <DatePicker
                    selected={assignProviderEndDate}
                    onChange={(date) => setAssignProviderEndDate(date)}
                    placeholdertext="Select an end date"
                    className="datepicker_Date_of_assignProvider" 
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

      {/* ==================================== */}
      {/* Edit Modal for Assigning Provider */}
       {isModalOpenofEditAssignProvider && (
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}>
          
        <Modal.Dialog>
          <Modal.Header closeButton onClick={closeModalofAssignProvider}>
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
                    
                    onChange={(e) => {
                      const [id, name] = e.target.value.split('|'); // Split the concatenated value
                      setSelectedAssignProvider(e.target.value);   // Update the full `id|name` in state
                      setSelectedProviderId(id);                   // Store the provider ID
                      
                    }}
                    
                >
                    {ProviderDataAssignProvider.length > 0 ? (
                      ProviderDataAssignProvider.map((provider) => (
                        
                        <MenuItem 
                          key={provider.id} 
                          value={`${provider.id}|${provider.provider_first_name} ${provider.provider_last_name}`}
                        >
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
                  selected={assignProviderStartDate ? new Date(assignProviderStartDate) : null} // Show date from DB or null if empty
                  onChange={(date) => {
                    console.log("Selected Date:", date);
                    setAssignProviderStartDate(format(date, "yyyy-MM-dd")); // Update the state when a new date is selected
                  }}
                  dateFormat="dd/MM/yyyy" 
                  className="datepicker_Date_of_assignProvider" 
                />
                </div>
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <DatePicker
                    selected={assignProviderEndDate}
                    onChange={(date) => setAssignProviderEndDate(date)}
                    placeholdertext="Select an end date"
                    className="datepicker_Date_of_assignProvider" 
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModalofAssignProvider}>
              Close
            </Button>
            <Button variant="primary" onClick={handelAssignProviderData}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
      )}
    </div>
</div>
  );
};

export default AssignProviders;

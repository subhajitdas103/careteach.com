import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Students.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import Modal from 'react-bootstrap/Modal';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Students = () => {

  const location = useLocation();
  const message = location.state?.message;

  const navigate = useNavigate();
  const [data, setData] = useState([]); // Student data
  const [show, setShow] = useState(false); // Modal visibility
  const [SelectedStudentToDelete, setSelectedStudentToDelete] = useState(null); 

  useEffect(() => {
    axios.get('api/Students')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddStudent = () => {
    navigate('/AddStudent');
  };

  const EditStudentClick = (id) => {
    navigate(`/EditStudent/${id}`);
  };

  const backToDashboard = () => {
    navigate('/dashboard');
  };

  const handleClose = () => {
    setShow(false);
    setSelectedStudentToDelete(null);
  };

  const handleShow = (student) => {
    setSelectedStudentToDelete(student);
    setShow(true);
  };

  const confirmDelete = () => {
    if (SelectedStudentToDelete) {
      axios.delete(`api/DeleteStudent/${SelectedStudentToDelete.id}`)
        .then(() => {
          setData(data.filter(student => student.id !== SelectedStudentToDelete.id));
          setShow(false);
          setSelectedStudentToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
        });
    }
  };
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
 const [studentDetails, setStudent] = useState(null);
  const [StudentServices, setStudentServices] = useState([]);
  const [Parents, setParentsDetails] = useState(null);
  const OpenModalAssignProvider = (id) => {
    console.log('Student ID passed:', id); // Log the ID to the console
    // alert(id); // Show the ID in an alert
    setSelectedStudentId(id); // Store the selected student ID
    setIsModalOpen(true); // Open the modal
  };



  // Show service Type in Assign Service 
  // const [StudentServices, setStudentServicesShow] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  useEffect(() => {
    if (data.StudentServices) {
      setStudentServicesShow(data.StudentServices);
    }
  }, [data]);

  const handleChange = (event) => {
    setSelectedService(event.target.value);
  };
  // alert(id);
  // ====================================================
const fetchStudentDetails = async () => {
  if (!selectedStudentId) return;
      try {
        const response = await fetch(`/api/StudentDataFetchAsID/${selectedStudentId}`);
        const data = await response.json();
        console.log("API Response 2:", data); 
    
        if (data.studentDetails) {
          setStudent(data.studentDetails);
        }
        if (data.Parents) {
          setParentsDetails(data.Parents);
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
    }, [selectedStudentId]); // Fetch when `id` changes
    

  // -------------------------------------

 





  // Fetch provider data
  const [providerdata, setProviderData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  useEffect(() => {
    axios
      .get("api/ViewProviders")
      .then((response) => {
        console.log("API Response:", response.data);
        const formattedData = response.data.map((provider) => ({
          id: provider.id,
          name: `${provider.provider_first_name} ${provider.provider_last_name}`,
          rate: `${provider.rate}`,
        }));
        setProviderData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setProviderData([]);
      });
  }, []);

  const handelChangeProvider = (event) => {
    setSelectedProvider(event.target.value);
    console.log("Selected Provider:", event.target.value);
  };

  // Rate and other fields
  const [inputRate, setInputRate] = useState("");
  const handleRateChange = (e) => {
    setInputRate(e.target.value);
  };
// ===================== Add to DB Assign Provider Data ==================================
  const [selectedAssignProvider , setSelectedAssignProvider] = useState("");
  const [inputRateAssignProvider, setInputRateAssignProvider ] = useState("");
  const [selectedAssignProviderLocation , setSelectedAssignProviderLocation] = useState("");
  const [selectedAssignProviderService , setSelectedAssignProviderService  ] = useState("");
  const [inputWklyHoursAssignProvider , setinputWklyHoursAssignProvider  ] = useState("");
  const [inputYearlyHoursAssignProvider , setinputYearlyHoursAssignProvider  ] = useState("");
  const [AssignProviderstartDate , setAssignProviderStartDate] = useState(null);
  const [AssignProviderendDate, setAssignProviderEndDate ] = useState(null);


  const handelAssignProviderData = async () => {
  console.log("handleAssignProvider triggered");

  // Populate formData with state values
  const formData = {
    selectedAssignProvider,
    inputRateAssignProvider,
    selectedAssignProviderLocation,
    selectedAssignProviderService,
    inputWklyHoursAssignProvider,
    inputYearlyHoursAssignProvider,
    AssignProviderstartDate,
    AssignProviderendDate,
  };

  console.log('Form data:', formData);

  try {
    const response = await axios.post('/api/AssignProvider', JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Data sent successfully:', response.data);
  } catch (error) {
    // toast.error("An error occurred. Please try again.");
    console.error('There was an error sending data:', error.response?.data || error.message);
  }
};

  
  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>Students</h3>
          <div onClick={backToDashboard}>
            <i className="fa fa-backward fc-back-icon" aria-hidden="true" id="back_student_click"></i>
          </div>
        </div>
      </div>

      <div className="row col-md-12 form-grouptop_search topnav">
        <div className="search-container">
          <form className="search-bar dashboard-list">
            <input type="text" name="search" className="search-field" placeholder="Search for student" />
            <button type="submit" className="fa-search-icon">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>

      <div className="add-student-btn" onClick={handleAddStudent}>
        <i className="fa fa-user-plus add-student-icon"></i>Add a Student
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th>Student Name</th>
              <th>School Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((student, index) => (
                <tr key={index}>
                  <td className="col-md-5">
                    <div className="student-name">{`${student.first_name} ${student.last_name}`}</div>
                  </td>
                  <td className="col-md-5">{student.school_name}</td>
                  <td className="col-md-2">
                    <div className="status-area">
                      <div className="student-edit-click" onClick={() => EditStudentClick(student.id)}>
                        <i className="fa fa-edit fa-1x fa-icon-img"></i>
                      </div>
                      <button type="button" className="holiday-delete" onClick={() => handleShow(student)}>
                        <i className="fa fa-trash fa-1x fa-icon-img"></i>
                      </button>

                      <button type="button" className="assignProviderBTN" style={{ backgroundColor: '#fff'}} onClick={() => OpenModalAssignProvider(student.id)} // ✅ Correct usage
                      >
                        <div className="assign-pro-btn">Assign Provider</div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Students available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Student Deletion */}
      {SelectedStudentToDelete && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Student</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete this Student-{" "}
              <strong className="student-name-delete-modal">
                {SelectedStudentToDelete.first_name} {SelectedStudentToDelete.last_name}
              </strong>
              ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-button" variant="secondary" onClick={handleClose}>
              <i className="fa-sharp-duotone fa-solid fa-xmark"></i>
            </Button>
            <Button className="delete-button" variant="danger" onClick={confirmDelete}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      )}

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
                    {providerdata?.length > 0 ? (
                      providerdata.map((provider) => (
                        <MenuItem key={provider.id} value={provider.name}>
                          {provider.name} 
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
                  onChange={(e) => setinputYearlyHoursAssignProvider(e.target.value)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Yearly Hours"
                />
                </div>
              </div>
              {/* ============== */}
  
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "4px" }}>
                  <DatePicker
                    selected={AssignProviderstartDate}
                    onChange={(date) => setAssignProviderStartDate(date)}
                    placeholdertext="Select a start date"
                  />
                </div>
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <DatePicker
                    selected={AssignProviderendDate}
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
    </div>
  );
}

export default Students;

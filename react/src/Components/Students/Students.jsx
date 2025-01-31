import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Students.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import Modal from 'react-bootstrap/Modal';
import { DatePicker } from 'rsuite';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";
import 'rsuite/dist/rsuite.min.css';
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const Students = () => {
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { userRollID, userRollName } = useAuth(); 
  console.log("Updated Roll Name:", userRollName);
  console.log("Updated Roll ID:", userRollID);   
       
  const location = useLocation();
  const message = location.state?.message;
  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [message]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [SelectedStudentToDelete, setSelectedStudentToDelete] = useState(null); 

  
  useEffect(() => {
    // Set loading state to false once the user data is available
    if (userRollID && userRollName) {
      setLoading(false);
    }
  }, [userRollID, userRollName]);


  useEffect(() => {
    if (!searchQuery && userRollID && userRollName) {
      setLoading(true);
    axios.get(`${backendUrl}/api/Studentsincalendar/${userRollID}/${userRollName}`)

      .then((response) => {

        if (Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data); // Update state with valid data
        } else {
          console.warn("No data available or invalid data format.");
        }

        console.log(response.data);
      })

      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loader after fetch completes
      });
    }
  }, [userRollID, userRollName]);

  



  // ==================================
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

// =========Start==========Delete Student ====================
  const confirmDelete = () => {
    if (SelectedStudentToDelete) {
      axios.delete(`${backendUrl}/api/DeleteStudent/${SelectedStudentToDelete.id}`)
        .then(() => {
          setData(data.filter(student => student.id !== SelectedStudentToDelete.id));
          setShow(false);
          setSelectedStudentToDelete(null);
          toast.success("Student successfully Deleted!", {
                                position: "top-right", 
                                autoClose: 5000,
                              });
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
        });
    }
  };
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const OpenAssignProvider = (id) => {
    console.log('Student ID passed:', id);
    setSelectedStudentId(id); // Store the selected student ID
    navigate(`/AssignProviders/${id}`);
  };

 // ==========End=========Delete Student ====================

  


  // ======================Fetch Student details==============================
   const [StudentServices, setStudentServices] = useState([]);
const fetchStudentDetails = async () => {
  if (!selectedStudentId) return;
      try {
        const response = await fetch(`${backendUrl}/api/StudentDataFetchAsID/${selectedStudentId}`);
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


  // ===========Search Result====================

  const [searchQuery, setSearchQuery] = useState('');

 const handleSearch = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.get(`${backendUrl}/api/search`, {
            params: {
                query: searchQuery,
                userRollID: userRollID,
                userRollName: userRollName
            }
        });
        // Handle the response here
        console.log(response.data); 
        setData(response.data);// Example: logging the response data
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};
 
return (
<div>
    <ToastContainer />
    <div className="dashboard-container">
      {loading ? (
        <div className="dashbord-container">
          <div className="row dashbord-list">
            <div className="heading-text">
              <h3>
                <Skeleton width={150} height={30} />
              </h3>
              <p>
                <Skeleton width={200} height={20} />
              </p>
            </div>
    
            <div className="row dashbord-list">
              <div className="stu-pro-field-div">
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={100} height={20} /></label>
                  <Skeleton height={40} width={'100%'} />
                </div>
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={100} height={20} /></label>
                  <Skeleton height={40} width={'100%'} />
                </div>
              </div>
    
              <div className="stu-pro-field-div">
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={120} height={20} /></label>
                  <Skeleton height={45} width={'100%'} />
                </div>
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={80} height={20} /></label>
                  <Skeleton height={40} width={'100%'} />
                  <p className="error-message"><Skeleton width={150} height={15} /></p>
                </div>
              </div>
    
              <div className="stu-pro-field-div">
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={80} height={20} /></label>
                  <Skeleton height={40} width={'100%'} />
                </div>
                <div className="col-md-6 student-profile-field">
                  <label><Skeleton width={80} height={20} /></label>
                  <Skeleton height={80} width={'100%'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
    <header>
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3 style={{ marginTop: "-44px" }}>Students</h3>
          <div onClick={backToDashboard}>
            <i className="fa fa-backward fc-back-icon" aria-hidden="true" id="back_student_click"></i>
          </div>
        </div>
      </div>
      

      <div className="row col-md-12  form-grouptop_search topnav">
          <div className="search-container">
              <form className="search-bar dashboard-list form-floating" onSubmit={handleSearch}>
                  <input
                      type="text"
                      name="search"
                      className="search-field"
                      placeholder="Search for Student"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="fa-search-icon">
                      <i className="fa fa-search"></i>
                  </button>
              </form>
          </div>
      </div>
      {
         userRollName !== 'Provider' && (
        <div className="add-student-btn" onClick={handleAddStudent}>
            <i className="fa fa-user-plus add-student-icon"></i>Add Student
        </div>
          )
      }
      <div className="tbl-container bdr tbl-container-student"  style={{ marginTop: '3rem' }}> 
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th>Student Name</th>
              <th>School Name</th>
              <th>Action</th>
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
                      {userRollName !== "Provider" && (
                        <>
                          <div className="student-edit-click" onClick={() => EditStudentClick(student.id)}>
                            <i className="fa fa-edit fa-1x fa-icon-img"></i>
                          </div>
                          <button type="button" className="holiday-delete" onClick={() => handleShow(student)}>
                            <i className="fa fa-trash fa-1x fa-icon-img"></i>
                          </button>
                          <button
                            type="button"
                            className="assignProviderBTN"
                            style={{ backgroundColor: "#fff" }}
                            onClick={() => OpenAssignProvider(student.id)}
                          >
                            <div className="assign-pro-btn">Assign Provider</div>
                          </button>
                        </>
                      )}
                      {userRollName === "Provider" && (
                        <button
                          type="button"
                          className="assignProviderBTN"
                          style={{ backgroundColor: "#fff" }}
                          onClick={() => OpenAssignProvider(student.id)}
                        >
                          <div className="assign-pro-btn">View Student Details</div>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No Students available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      </header>
      </>
      )}

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
            <Button className="delete-button" variant="danger" onClick={confirmDelete}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
</div>
  );
}

export default Students;

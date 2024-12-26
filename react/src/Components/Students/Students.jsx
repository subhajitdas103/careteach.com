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

import 'rsuite/dist/rsuite.min.css';
// import { useLocation } from 'react-router-dom';
const Students = () => {
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
    if (!searchQuery) {
    axios.get('api/Students')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);



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


  // ===========Search Result====================

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.get(`/api/search?query=${searchQuery}`);
          setData(response.data); // Update the student list with the search results
      } catch (error) {
          console.error('Error fetching Prov:', error);
      }
  };
  

  
  return (
<div>
<ToastContainer />
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>Students</h3>
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
                      placeholder="Search for student"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
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

                      <button type="button" className="assignProviderBTN" style={{ backgroundColor: '#fff'}} onClick={() => OpenAssignProvider(student.id)} // ✅ Correct usage
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
    </div>
</div>
  );
}

export default Students;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Students.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; 

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
    // alert(studentId);
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

  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>Students</h3>
          <div onClick={backToDashboard}>
            <i
              className="fa fa-backward fc-back-icon"
              aria-hidden="true"
              id="back_student_click"
            ></i>
          </div>
        </div>
      </div>

      <div className="row col-md-12 form-grouptop_search topnav">
        <div className="search-container">
          <form className="search-bar dashboard-list">
            <input
              type="text"
              name="search"
              className="search-field"
              placeholder="Search for student"
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
                      <button
                        type="button"
                        className="holiday-delete"
                        onClick={() => handleShow(student)}
                      >
                        <i className="fa fa-trash fa-1x fa-icon-img"></i>
                      </button>
                      <div className="assign-pro-btn">Assign Provider</div>
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
  );
};

export default Students;

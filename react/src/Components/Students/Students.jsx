import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import "./Students.css";
import { useNavigate } from "react-router-dom";
// Students.js
import { useLocation } from 'react-router-dom';
const Students  = () => {
  const location = useLocation();
  const message = location.state?.message;


  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
      // Fetch data from API
      axios.get('api/Students')
          .then((response) => {
              setData(response.data);
              console.log(data);
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
          });
  }, []);

 
 // Function to navigate to the 'Add Student' page
 const handleAddStudent = () => {
  navigate('/AddStudent'); // Specify the path you want to navigate to
  
};
const back_to_dashboard = () => {
  navigate('/dashboard'); // Specify the path you want to navigate to
};
  return (
   
    <div className="dashboard-container">      
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>Students</h3>
          <div className="" id="" onClick={back_to_dashboard}>
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

      <div className="add-student-btn" id="add_student_btn" onClick={handleAddStudent}>
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
            {data.map((student, index) => (
              <tr key={index}>
                <td className="col-md-5">
                  <div className="student-name" id="student_details_click">
                  {`${student.first_name} ${student.last_name}`}
                  </div>
                </td>
                <td className="col-md-5">{student.school_name}</td>
                <td className="col-md-2">
                  <div className="status-area">
                    <div className="student-edit-click" id="student_edit_click">
                      <i className="fa fa-edit fa-1x fa-icon-img"></i>
                    </div>
                    <button
                      type="button"
                      id="myBtn"
                      className="holiday-delete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                    >
                      <i className="fa fa-trash fa-1x fa-icon-img"></i>
                    </button>
                    <div className="assign-pro-btn">Assign Provider</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;

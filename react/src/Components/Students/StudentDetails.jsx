import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Students.css";

const StudentDetails = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student details based on ID
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/StudentDataFetchAsID/${id}`);
      setStudent(response.data);
    } catch (error) {
      setError("Error fetching student details");
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the id changes
  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  // Destructure student and parent data
  const { first_name, last_name, home_address, disability } = student?.student || {};
  const { parent_name, parent_email, ph_no } = student?.parent || {};

  // Back button functionality
  const handleBackClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  // Render loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    return <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>;
  }

  return (
    <div>
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3 style={{ marginTop: "-42px" }}>Students Details</h3>
          <div>
            <i
              className="fa fa-backward fc-back-icon"
              aria-hidden="true"
              id="back_student_click"
              onClick={handleBackClick}
            ></i>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="row dashboard-list" style={{marginTop:"-160px"}}>
          
          {/* Student Information Table */}
          <div className="heading-text">
            <h2 style={{ fontSize: "20px" }}>Student Information</h2>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Student Details</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{first_name} {last_name}</td>
                </tr>
                <tr>
                  <td>Home Address</td>
                  <td>{home_address || "N/A"}</td>
                </tr>
                <tr>
                  <td>Disability</td>
                  <td>{disability || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          {/* Parent Information Table */}
        <div className="row dashboard-list" style={{marginTop:"-160px"}}>
          <div className="heading-text">
            <h2 style={{ fontSize: "20px" }}>Parent Information</h2>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Parent Details</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Parent Name</td>
                  <td>{parent_name}</td>
                </tr>
                <tr>
                  <td>Parent Email</td>
                  <td>{parent_email}</td>
                </tr>
                <tr>
                  <td>Parent Phone</td>
                  <td>{ph_no}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

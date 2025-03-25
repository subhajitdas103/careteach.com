import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Students.css"; // Updated CSS file

const StudentDetails = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [prevTab, setPrevTab] = useState(1);

  const fetchStudentDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/StudentDataFetchAsID/${id}`);
      setStudent(response.data);
    } catch (error) {
      setError("Error fetching student details");
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  const { first_name, last_name,school_name ,home_address,grade, disability } = student?.student || {};
  const { parent_name, parent_email, ph_no,parent_type } = student?.parent || {};
  const studentServices = student?.StudentServices || [];

console.log("student",student);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;

  return (
    <div className="container">
      {/* Header */}
      <div className="header" style={{ marginBottom: "50px" }}></div>
      
      <div className="back-button-container">
        <i className="fa fa-backward fc-back-icon back-icon" onClick={handleBackClick}></i>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={activeTab === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>Basic Information</button>
        <button className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>Parent Information</button>
        <button className={activeTab === 3 ? "active" : ""} onClick={() => handleTabChange(3)}>Services</button>
      </div>
      <h3 className="student-details-heading">Details of Student - {first_name} {last_name}</h3>

      {/* Tab Content with Slide Animation */}
      <div className={`tab-content ${activeTab > prevTab ? "slide-left" : "slide-right"}`}>
        {activeTab === 1 && (
          <div>
            <table className="table">
              <tbody>
                <tr><td>School Name</td><td>{school_name}</td></tr>
                <tr><td>Home Address</td><td>{home_address || "N/A"}</td></tr>
                <tr><td>Clasification Disability</td><td>{disability || "N/A"}</td></tr>
                <tr><td>Grade</td><td>{grade || "N/A"}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <table className="table">
              <tbody>
                <tr><td>Parent Name</td><td>{parent_name || "N/A"}</td></tr>
                <tr><td>Parent Type</td><td>{parent_type || "N/A"}</td></tr>
                <tr><td>Parent Email</td><td>{parent_email || "N/A"}</td></tr>
                <tr><td>Parent Phone</td><td>{ph_no || "N/A"}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            {/* <h3>Services</h3> */}
            {studentServices.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Service Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Weekly Mandate</th>
                    <th>Yearly Mandate</th>
                  </tr>
                </thead>
                <tbody>
                  {studentServices.map((service, index) => (
                    <tr key={index}>
                      <td>{service.service_type || "N/A"}</td>
                      <td>{service.start_date || "N/A"}</td>
                      <td>{service.end_date || "N/A"}</td>
                      <td>{service.weekly_mandate || "N/A"}</td>
                      <td>{service.yearly_mandate || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No services found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;

import React, { useState } from 'react';

const AddSchool = () => {
  const [schoolName, setSchoolName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [workingDays, setWorkingDays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [status, setStatus] = useState('Inactive');
  const [dropdownVisible, setDropdownVisible] = useState({
    school: false,
    principal: false,
    working: false,
    holiday: false,
  });
const [petStatus, setPetStatus] = useState('Choose Holidays');
const handlePetStatusChange = (status) => {
  setPetStatus(status);
};

  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text personal-info-text">
          <h3>Add Basic Information of School</h3>
          <i className="fa fa-backward fc-back-icon" aria-hidden="true"></i>
        </div>
      </div>

      <div className="row dashboard-list personal-profile">
        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>School Name:</label>
            <input
              type="text"
              className="stu-pro-input-field sch-dropbtn"
              placeholder="Enter a school name"
              
            />
            <i className="" aria-hidden="true"></i>
           
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Principal Name:</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Principal Name"
            />
            <i className="" aria-hidden="true"></i>
           
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>Address:</label>
            <textarea
              rows="6"
              cols="50"
              className="text-field stu-pro-input-field"
              placeholder="Enter home address"
              
            ></textarea>
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Phone:</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter phone number"
              
            />
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>Working Days:</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Working Days"
              
            />
            <i className="" aria-hidden="true"></i>
            
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Holidays:</label>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle stu-pro-input-field"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {petStatus}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handlePetStatusChange("Holidays 2024-25")}
                  >
                    Holidays 2024-25
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handlePetStatusChange("Holidays 2023-2024")}
                  >
                    Holidays 2023-2024
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="stu-pro-field-div">
          <div className="col-md-6 student-profile-field">
            <label>Status:</label>
            <div className="radio-btn">
              <div className="radio">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  
                />
                <label>Inactive</label>
              </div>
              <div className="radio">
                <input
                  type="radio"
                  name="status"
                 
                />
                <label>Active</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="save-student-btn" onClick={() => console.log('Save School')}>
        Save School
      </div>
    </div>
  );
};

export default AddSchool;

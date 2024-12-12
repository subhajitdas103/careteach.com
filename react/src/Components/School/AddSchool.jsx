import React, { useState } from 'react';

function App() {
 

  return (
    <div className="dashboard-container">
      <header>
        <div className="row dashboard-list">
          <div className="col-md-6 student-profile-field">
            <label>School Name:</label>
            <input
              type="text"
              placeholder="Enter a school name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <div className="col-md-6 student-profile-field">
            <label>Working Days:</label>
            <div
              className="working-days-dropdown"
              onClick={() => setShowDaysDropdown(!showDaysDropdown)}
            >
              <input
                type="text"
                readOnly
                placeholder="Select Working Days"
                value={workingDays.length ? workingDays.join(', ') : ''}
                onClick={() => setShowDaysDropdown(!showDaysDropdown)}
              />
            </div>
            {showDaysDropdown && (
              <div className="dropdown-menu">
                {days.map((day) => (
                  <div key={day} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={workingDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <label>{day}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

import React, { useState } from "react";

const Billing = () => {
  const [dropdowns, setDropdowns] = useState({
    provider: false,
    student: false,
    month: false,
    year: false,
  });

  const toggleDropdown = (dropdown) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  return (
    <div className="dashbord-container-billing">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>Billing</h3>
          <i className="fa fa-backward fc-back-icon" id="back_billing_click" aria-hidden="true"></i>
        </div>
      </div>

      <div className="row dashbord-list billing-dashbord-list">
        <div className="row filter-billing">
          {/* Provider Name */}
          <div className="col student-profile-field">
            <label>Provider Name</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Provider Name"
              onClick={() => toggleDropdown("provider")}
            />
            <i className="fa fa-caret-down dropdown-arrow" aria-hidden="true"></i>
            {dropdowns.provider && (
              <ul className="dropdown-content dropdown-content-billing">
                <li>John Anderson</li>
                <li>Sarah Thompson</li>
                <li>Emily Rodriguez</li>
                <li>Michael Brown</li>
                <li>Jessica Wilson</li>
              </ul>
            )}
          </div>

          {/* Student Name */}
          <div className="col student-profile-field">
            <label>Student Name</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Student Name"
              onClick={() => toggleDropdown("student")}
            />
            <i className="fa fa-caret-down dropdown-arrow" aria-hidden="true"></i>
            {dropdowns.student && (
              <ul className="dropdown-content dropdown-content-billing">
                <li>Ava Miller</li>
                <li>Emma Johnson</li>
                <li>Elijah Wilson</li>
                <li>Liam Smith</li>
                <li>Noah Williams</li>
                <li>Olivia Brown</li>
                <li>James Davis</li>
              </ul>
            )}
          </div>

          {/* Invoice Month */}
          <div className="col student-profile-field">
            <label>Invoice Month</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Month"
              onClick={() => toggleDropdown("month")}
            />
            <i className="fa fa-caret-down dropdown-arrow" aria-hidden="true"></i>
            {dropdowns.month && (
              <ul className="dropdown-content dropdown-content-billing">
                <li>January</li>
                <li>February</li>
                <li>March</li>
                <li>April</li>
                <li>May</li>
                <li>June</li>
                <li>July</li>
                <li>August</li>
                <li>September</li>
                <li>October</li>
                <li>November</li>
                <li>December</li>
              </ul>
            )}
          </div>

          {/* Invoice Year */}
          <div className="col student-profile-field">
            <label>Invoice Year</label>
            <input
              type="text"
              className="stu-pro-input-field"
              placeholder="Enter Year"
              onClick={() => toggleDropdown("year")}
            />
            <i className="fa fa-caret-down dropdown-arrow" aria-hidden="true"></i>
            {dropdowns.year && (
              <ul className="dropdown-content dropdown-content-billing">
                <li>2020</li>
                <li>2021</li>
                <li>2022</li>
                <li>2023</li>
                <li>2024</li>
              </ul>
            )}
          </div>

          {/* Clear Button */}
          <div className="savebtn">
            <div className="add-student-save filter-clear-btn">
              <i className="fa-solid fa-eraser me-1"></i>Clear
            </div>
          </div>
        </div>
      </div>

      <div className="tbl-container bdr tbl-container-student tbody-container-student">
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th className="col-md-3">Student Name</th>
              <th className="col-md-2">Provider Name</th>
              <th className="col-md-2">Invoice Month</th>
              <th className="col-md-2">Invoice Year</th>
              <th className="col-md-2">Total Hours</th>
              <th className="col-md-1">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Liam Smith</td>
              <td>John Anderson</td>
              <td>January</td>
              <td>2021</td>
              <td>3.00 hrs</td>
              <td>
                <div className="status-area">
                  <div>
                    <i className="fa-solid fa-download fa-icon-img"></i>
                  </div>
                  <div id="view_invoice">
                    <i className="fa fa-eye fa-icon-img" aria-hidden="true"></i>
                  </div>
                </div>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;

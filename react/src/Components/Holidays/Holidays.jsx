import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";
const Holidays = () => {
    const navigate = useNavigate();
  const holidays = [
    { name: "Holiday 1", startDate: "05/04/2023", endDate: "" },
    { name: "Holiday 2", startDate: "10/04/2023", endDate: "" },
    { name: "Holiday 3", startDate: "08/05/2023", endDate: "15/05/2023" },
    { name: "Holiday 4", startDate: "22/05/2023", endDate: "30/05/2023" },
  ];

  const handleEdit = (holiday) => {
    console.log("Edit holiday:", holiday);
  };

  const handleDelete = (holiday) => {
    console.log("Delete holiday:", holiday);
  };

  const AddHoliday = () => {
    navigate('/AddHoliday'); // Specify the path you want to navigate to
  };

  return (
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>Holidays</h3>
          <i className="fa fa-backward fc-back-icon" aria-hidden="true" id="back_holiday_click"></i>
        </div>
      </div>

      <div className="add-student-btn" id="add_holiday_btn" onClick={AddHoliday}>
        <i className="fa fa-mug-hot me-1"></i>Add holiday
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, index) => (
              <tr key={index}>
                <td className="col-md-3">{holiday.name}</td>
                <td className="col-md-4">{holiday.startDate}</td>
                <td className="col-md-4">{holiday.endDate}</td>
                <td className="col-md-1">
                  <div className="status-area">
                    <div onClick={() => handleEdit(holiday)}>
                      <i className="fa fa-edit fa-1x fa-icon-img"></i>
                    </div>
                    <button
                      type="button"
                      className="holiday-delete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      onClick={() => handleDelete(holiday)}
                    >
                      <i className="fa fa-trash fa-1x fa-icon-img"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog deleteModal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="deleteModalLabel">
                Confirm Delete
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this holiday?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger">
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                style={{ backgroundColor: "#034b74" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;

import React from "react";
import { useNavigate } from "react-router-dom";
const School = () => {
    const navigate = useNavigate();
  const schools = [
    {
      name: "Lincoln High School",
      email: "lincolnhs12@gmail.com",
      phone: "2344 442 234",
      status: "active",
    },
    {
      name: "Riverside Middle School",
      email: "riversidems33@gmail.com",
      phone: "2344 442 234",
      status: "inactive",
    },
    {
      name: "Washington Elementary School",
      email: "washingtonelem76@gmail.com",
      phone: "2344 442 234",
      status: "inactive",
    },
    {
      name: "Jefferson High School",
      email: "jeffersonhs11@gmail.com",
      phone: "2344 442 234",
      status: "active",
    },
    {
      name: "Franklin Academy",
      email: "franklinacademy54@gmail.com",
      phone: "2344 442 234",
      status: "inactive",
    },
    {
      name: "Liberty High School",
      email: "libertyhs23@gmail.com",
      phone: "2344 442 234",
      status: "active",
    },
    {
      name: "Central High School",
      email: "centralhs76@gmail.com",
      phone: "2344 442 234",
      status: "active",
    },
  ];
  const addSchool = () => {
    navigate('/AddSchool'); // Specify the path you want to navigate to
  };
  return (
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>School</h3>
          <i
            className="fa fa-backward fc-back-icon"
            aria-hidden="true"
            id="back_school_click"
          ></i>
        </div>
      </div>

      <div className="row col-md-12 form-grouptop_search topnav">
        <div className="search-container">
          <form className="search-bar">
            <input
              type="text"
              name="search"
              className="search-field"
              placeholder="Search for school"
            />
            <button type="submit" className="fa-search-icon">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>

      <div className="add-student-btn" id="add_school_btn" onClick={addSchool}>
        <i className="fa-solid fa-school-flag me-1"></i>Add School
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th className="col-md-3">School Name</th>
              <th className="col-md-4">Email</th>
              <th className="col-md-3">Phone</th>
              <th className="col-md-1">Status</th>
              <th className="col-md-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, index) => (
              <tr key={index}>
                <td>{school.name}</td>
                <td>{school.email}</td>
                <td>{school.phone}</td>
                <td
                  className={
                    school.status === "active" ? "text-success" : "text-danger"
                  }
                >
                  <span
                    className={
                      school.status === "active" ? "activedot" : "inactivedot"
                    }
                  ></span>
                  {school.status}
                </td>
                <td>
                  <div className="status-area">
                    <div id="edit_school_btn">
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

export default School;

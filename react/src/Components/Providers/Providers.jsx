import React from "react";
import { useNavigate } from "react-router-dom";
import './Providers.css'; // Optional: Add custom styles
const Providers = () => {
const navigate = useNavigate();
const addProvider = () => {
    navigate('/AddProviders'); // Specify the path you want to navigate to
    };

  const backtodashboard = () => {
    navigate('/dashboard');
  };
   
  return (
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>Providers</h3>
          <i
            className="fa fa-backward fc-back-icon"
            aria-hidden="true"
            id="back_provider_click" onClick = {backtodashboard}
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
              placeholder="Search for provider"
            />
            <button type="submit" className="fa-search-icon">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>

      <div className="add-student-btn" id="add_provider_btn"  onClick={addProvider}>
        <i className="fa-brands fa-product-hunt me-1"></i>Add a Provider
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-student">
          <thead className="bg-red">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                firstName: "John",
                lastName: "Anderson",
                email: "john.anderson@gmail.com",
                phone: "100000089",
                rate: "12",
                status: "Active",
              },
              {
                firstName: "Sarah",
                lastName: "Thompson",
                email: "sarah.thompson@gmail.com",
                phone: "100000089",
                rate: "12",
                status: "Active",
              },
              {
                firstName: "Emily",
                lastName: "Rodriguez",
                email: "emily.rodriguez@gmail.com",
                phone: "100000089",
                rate: "12",
                status: "Active",
              },
              {
                firstName: "Michael",
                lastName: "Brown",
                email: "michael.brown@gmail.com",
                phone: "100000089",
                rate: "12",
                status: "Active",
              },
              {
                firstName: "Jessica",
                lastName: "Wilson",
                email: "jessica.wilson@gmail.com",
                phone: "100000089",
                rate: "12",
                status: "Active",
              },
            ].map((provider, index) => (
              <tr key={index}>
                <td>{provider.firstName}</td>
                <td>{provider.lastName}</td>
                <td>{provider.email}</td>
                <td>{provider.phone}</td>
                <td>{provider.rate}</td>
                <td>{provider.status}</td>
                <td className="col-md-2">
                  <div className="status-area">
                    <div>
                      <i className="fa fa-edit fa-1x fa-icon-img"></i>
                    </div>
                    <button
                      type="button"
                      className="holiday-delete"
                    >
                      <i className="fa fa-trash fa-1x fa-icon-img"></i>
                    </button>
                    <button
                      type="button"
                      className="assign-pro-btn"
                    >
                      View Students
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

export default Providers;

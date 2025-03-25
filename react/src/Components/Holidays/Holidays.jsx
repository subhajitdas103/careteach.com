import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import './Holidays.css';
import { PropagateLoader } from "react-spinners";
// import logo from "../assets/logo.png"; 
import logo from "../../Assets/logo.png"; 
const Holidays = () => {
   const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [holidays, setHolidays] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedHolidayToDelete, setSelectedHolidayToDelete] = useState(null);

  useEffect(() => {
    const fetchHolidayDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/fetchHolidayData`);
        const data = response.data;
        if (Array.isArray(data)) {
          setHolidays(data);
        }
      } catch (error) {
        console.error("Error fetching holiday details:", error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
      
    };

    fetchHolidayDetails();
  }, []);

  const handleEdit = (id) => {
    // console.log("Edit holiday:", holiday);
    navigate(`/editHoliday/${id}`);
  };

  const handleDelete = (holiday) => {
    setSelectedHolidayToDelete(holiday);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedHolidayToDelete(null);
  };

  const confirmDelete = async () => {
    if (selectedHolidayToDelete) {
      try {
        await axios.delete(`${backendUrl}/api/DeleteHoliday/${selectedHolidayToDelete.id}`);

        setHolidays((prevHolidays) =>
          prevHolidays.filter((holiday) => holiday.id !== selectedHolidayToDelete.id)
        );

        setShow(false);
        setSelectedHolidayToDelete(null);

        toast.success("Holiday successfully deleted!", {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {
        console.error("Error deleting holiday:", error);
        toast.error("Failed to delete holiday. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const AddHoliday = () => {
    navigate("/AddHoliday");
  };

  const backToDashboard = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="dashbord-container">
       {loading ? (
        <div className="loader-container">
          <div className="loader-content">
            <img src={logo} alt="Loading..." className="logo-loader" />
            <PropagateLoader color="#3498db" size={10} />
          </div>
        </div>
      ) : (
      <>
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3 style={{ marginTop: "-42px" }}>Holidays</h3>
          
          <i
            className="fa fa-backward fc-back-icon"
            onClick={backToDashboard}
            aria-hidden="true"
            id="back_holiday_click"
          ></i>
        </div>
      </div>

      <div className="add-student-btn holiday_button" id="add_holiday_btn" onClick={AddHoliday}>
        <i className="fa fa-mug-hot me-1"></i>Add Holiday
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
            {holidays.length > 0 ? (
            holidays.map((holiday, index) => (
              <tr key={index}>
                <td className="col-md-3">{holiday.name}</td>
                <td className="col-md-4">
                  {new Date(holiday.start_date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="col-md-4">
                  {new Date(holiday.end_date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    
                    year: "numeric",
                  })}
               </td>
                <td className="col-md-1">
                  <div className="status-area">
                    <div onClick={() => handleEdit(holiday.id)}>
                      <i className="fa fa-edit fa-1x fa-icon-img"></i>
                    </div>
                    <button
                      type="button"
                      className="holiday-delete"
                      onClick={() => handleDelete(holiday)}
                    >
                      <i className="fa fa-trash fa-1x fa-icon-img"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Holiday available.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      <ToastContainer />

      {selectedHolidayToDelete && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Holiday</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete this holiday?
              {/* <strong>{selectedHolidayToDelete.name}</strong> */}
            </p>
          </Modal.Body>
          <Modal.Footer>
                      <Button className="delete-button" variant="danger" onClick={confirmDelete}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </Button>
                    </Modal.Footer>
        </Modal>
            )}
      </>    
  )}
    </div>
  );
};

export default Holidays;

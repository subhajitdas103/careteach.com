import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './School.css';
const School = () => {
  const location = useLocation();
  const message = location.state?.message;
  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [message]);
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
 
  const [show, setShow] = useState(false);
  const [IDSchool, setIDSchool] = useState(null);
    const [data, setData] = useState([]);
  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  const fetchSchoolDetails = async () => {
    try {
      
      const response = await fetch('/api/fetchSchoolData');
      const data = await response.json();
      setSchools(data); // Update the state with fetched data
      console.log(data);
    } catch (error) {
      console.error('Error fetching school details:', error);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
    axios.get('/api/fetchSchoolData')
      .then((response) => {
        setSchools(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  const addSchool = () => {
    navigate('/AddSchool'); // Navigate to the add school page
  };
 
  const backToDashboard = () => {
    navigate('/Dashboard');
  };

  // const handleSearchSchoolChange = (e) => {
  //   setSearchQuery(e.target.value); // Update search query state
  // };


  const editSchool =(id) =>{
    alert(id);
    // navigate('/EditSchool');
    navigate(`/EditSchool/${id}`);
  }
  const handleShow = (id) => {
    setShow(true);
    setIDSchool(id);
    // alert(id);
  };
  const handleClose = () => {
    setShow(false);
   
  };
// alert(IDSchool);
  // =========Start==========Delete School ====================
  const confirmDeleteSchool = () => {
   

      axios
        .delete(`/api/DeleteSchool/${IDSchool}`)
        .then(() => {
          setShow(false); // Hides the modal or updates the state
          console.log('School deleted successfully');
           toast.success("School successfully Deleted!", {
                      position: "top-right", 
                      autoClose: 5000,
                    });
          // Optionally refresh the list or update the state
          fetchSchoolDetails();
        })
        .catch((error) => {
          console.error('Error deleting school:', error);
          // Show an error notification or message to the user
        });
    
  };
   // ===========Search Result====================

   const [searchQuery, setSearchQuery] = useState('');

   const handleSearchSchool = async (event) => {
       event.preventDefault();
       try {
           const response = await axios.get(`/api/searchschool?query=${searchQuery}`);
           setSchools(response.data); // Update the student list with the search results
       } catch (error) {
           console.error('Error fetching by Search:', error);
       }
   };


  return (
<div>
    <ToastContainer />
    <div className="dashboard-container">
      <div className="row dashboard-list">
        <div className="heading-text">
          <h3>School</h3>
          <i
            className="fa fa-backward fc-back-icon"
            aria-hidden="true"
            onClick={backToDashboard}
          ></i>
        </div>
      </div>

      <div className="row col-md-12 form-grouptop_search topnav">
          <div className="search-container">
              <form className="search-bar dashboard-list" onSubmit={handleSearchSchool}>
                  <input
                      type="text"
                      name="search"
                      className="search-field"
                      placeholder="Search for providers"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
            {schools.length > 0 ? (
              schools.map((school, index) => (
                <tr key={index}>
                  <td>{school.school_name}</td>
                  <td>{school.email}</td>
                  <td>{school.phone}</td>
                  <td className={`${school.status === "Active" ? "text-success" : "text-danger"}`}>
                    <span className={`${school.status === "Active" ? "activedot" : "inactivedot"}`}></span>
                    {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                  </td>
                  <td>
                    <div className="status-area">
                      <div id="edit_school_btn">
                        <i className="fa fa-edit fa-1x fa-icon-img"  onClick={() => editSchool(school.id)}></i>
                      </div>
                      <button
                        type="button"
                        id="myBtn"
                        className="holiday-delete"
                        
                      >
                        <i className="fa fa-trash fa-1x fa-icon-img" onClick={() => handleShow(school.id)}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No schools found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Student Deletion */}
     
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete School</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete this School{" "}
              <strong className="student-name-delete-modal">
           
              </strong>
              ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-button" variant="secondary" onClick={handleClose} >
              <i className="fa-sharp-duotone fa-solid fa-xmark"></i>
            </Button>
            <Button className="delete-button" variant="danger"onClick={confirmDeleteSchool}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      
    </div>
</div>
  );
};

export default School;

import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Providers.css';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Modal as FlowbitModal } from 'flowbite-react';
import { useParams } from 'react-router-dom'; // Import useParams
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";
const Providers = () => {

  const { userRollID, userRollName } = useAuth(); 
  console.log("Updated Roll Name:", userRollName);
  console.log("Updated Roll ID:", userRollID); 


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
   
  const [show, setShow] = useState(false);
  const [selectedProviderToDelete, setSelectedProviderToDelete] = useState(null);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // Close modal
  const handleClose = () => {
    setShow(false);
    setSelectedProviderToDelete(null); // Reset when modal is closed
  };

  // Show modal for provider deletion
  const handleShow = (provider) => {
    setSelectedProviderToDelete(provider);
    setShow(true);
  };

  // Handle provider delete action
  const deleteProvider = (provider) => {
    setSelectedProviderToDelete(provider);
    setShow(true);  // Show modal to confirm deletion
  };

  // Confirm deletion and remove provider
  const confirmDelete = () => {
    if (selectedProviderToDelete) {
      axios.delete(`${backendUrl}/api/DeleteProvider/${selectedProviderToDelete.id}`)
        .then((response) => {
          setData(data.filter(provider => provider.id !== selectedProviderToDelete.id));
          setShow(false); // Close the modal
          
          toast.success("Provider successfully Deleted!", {
            position: "top-right", 
            autoClose: 5000,
          });
        })
        .catch((error) => {
          console.error('Error deleting provider:', error);
        });
    }
  };

  const addProvider = () => {
    navigate('/AddProviders');
  };

  const backtodashboard = () => {
    navigate('/dashboard');
  };
// ======================  Fetch data from API=================
//  useEffect(() => {
//     if (!searchQuery && userRollID) {
//       axios
//         .get(`${backendUrl}/api/ViewProvidersbyrollID/${userRollID}`)
//         .then((response) => {
//           if (Array.isArray(response.data) && response.data.length > 0) {
//             setData(response.data); // Update state with valid data
//           } else {
//             console.warn("No data available or invalid data format.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//   }, []);


  useEffect(() => {
    if (!searchQuery && userRollID) { // Only make the call if userRollID exists
      axios
        .get(`${backendUrl}/api/ViewProvidersbyrollID/${userRollID}/${userRollName}`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setData(response.data); // Update state with valid data
          } else {
            console.warn("No data available or invalid data format.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Handle errors
        });
    }
  }, [backendUrl, userRollID]);
  
// =============================================================
const [isOpen, setIsOpen] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const handleOpenModal = () => setIsOpen(true);
const ViewStudentModalClick = (id) => {
  setIsModalOpen(true); 
 
  StudentOfAssignedProviders(id);
};
const redirectToEditProviders = (id) => {
  navigate(`/EditProviders/${id}`);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};
// =============================
const [ProviderDataAssignProvider, setAssignofStudentData] = useState(null);

const StudentOfAssignedProviders = async (id) => {
  try {
    const response = await fetch(`${backendUrl}/api/FetchStudentOfAssignedProviders/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response:", errorText);
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response Provider Data:", data);
    setAssignofStudentData(data);
  } catch (error) {
    setAssignofStudentData("");
    console.error("Error fetching provider data:", error);
  }
};

const handleStudentClick = (studentId) => {
  navigate('/students');
};
 
  // ===========Search Result====================

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.get(`${backendUrl}/api/searchproviders?query=${searchQuery}`);
          setData(response.data); // Update the student list with the search results
      } catch (error) {
          console.error('Error fetching by Search:', error);
      }
  };



  return (
<div>
    <ToastContainer />
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          <h3>Providers</h3>
          <i
            className="fa fa-backward fc-back-icon"
            aria-hidden="true"
            id="back_provider_click"
            onClick={backtodashboard}
          ></i>
        </div>
      </div>

      {userRollName !== "Provider" && (
      <div className="row col-md-12 form-grouptop_search topnav">
          <div className="search-container">
              <form className="search-bar dashboard-list" onSubmit={handleSearch}>
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
      )}
   
     
      {userRollName !== "Provider" && (
      <div className="add-student-btn" id="add_provider_btn" onClick={addProvider}>
        <i className="fa-brands fa-product-hunt me-1"></i>Add a Provider
      </div>
      )}

    
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
            {data.length > 0 ? (
              data.map((provider, index) => (
                <tr key={index}>
                  <td>{provider.provider_first_name}</td>
                  <td>{provider.provider_last_name}</td>
                  <td>{provider.provider_email}</td>
                  <td>{provider.provider_phone}</td>
                  <td>{provider.rate}</td>
                  <td>{provider.status}</td>
                  <td className="col-md-2">
                    <div className="status-area">
                    
                   
                        <div>
                          <button
                            type="button"
                            onClick={() => redirectToEditProviders(provider.id)}
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            <i className="fa fa-edit fa-1x fa-icon-img"></i>
                          </button>
                        </div>
                        {userRollName !== "Provider" && (
                        <button
                          type="button"
                          className="holiday-delete"
                          onClick={() => deleteProvider(provider)}
                        >
                          <i className="fa fa-trash fa-1x fa-icon-img"></i>
                        </button>
                      
                      )}
                      <button
                        type="button" onClick={() => ViewStudentModalClick(provider.id)}
                        className="assign-pro-btn"
                      >
                        View Students
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
              <td colSpan="9" className="text-center">No Providers Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for provider details */}
      {selectedProviderToDelete && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Provider</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p>
            Are you sure you want to delete the provider{" "}
            <strong className="provider-name-delete-modal">
              {selectedProviderToDelete.provider_first_name} {selectedProviderToDelete.provider_last_name}
            </strong>
            ?
          </p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-button" variant="secondary" onClick={handleClose}>
            <i className="fa-sharp-duotone fa-solid fa-xmark"></i>
            </Button>
            <Button className="delete-button" variant="danger"  onClick={confirmDelete}>
            <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      )}

               {/* View Student Click Modal */}
              <Modal show={isModalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Associated Students</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                  {ProviderDataAssignProvider && ProviderDataAssignProvider.length > 0 ? (
                    <ul>
                      {ProviderDataAssignProvider.map((assignStudent) => (
                       <li
                       key={assignStudent.student_id}
                       onClick={() => handleStudentClick(assignStudent.student_id)}
                        className="assign-student-name-mouse-over"
                     >
                       {assignStudent.student_name}
                     </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No Associated Student found.</p>
                  )}
                </Modal.Body>
  
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

    </div>
</div>
  );
};

export default Providers;

import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Providers.css';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Providers = () => {
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
      axios.delete(`api/DeleteProvider/${selectedProviderToDelete.id}`)
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
  useEffect(() => {
    axios.get('api/ViewProviders')
      .then((response) => {
        setData(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
// =============================================================
  return (
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

      <div className="add-student-btn" id="add_provider_btn" onClick={addProvider}>
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
                        <i className="fa fa-edit fa-1x fa-icon-img"></i>
                      </div>
                      <button
                        type="button"
                        className="holiday-delete"
                        onClick={() => deleteProvider(provider)}
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
              ))
            ) : (
              <tr>
                <td colSpan="7">No providers available.</td>
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
    </div>
  );
};

export default Providers;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from 'rsuite';
import { toast, ToastContainer } from 'react-toastify';
import { PropagateLoader } from "react-spinners";
import logo from "../../Assets/logo.png"; // Ensure this path is correct
import "rsuite/dist/rsuite.min.css"; 

const EditHoliday = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [holidayDatabyid, setHolidayData] = useState(null);
    const [holidayName, setHolidayName] = useState('');
    const [startDate, setHolidayStartDate] = useState(null);
    const [endDate, setHolidayEndDate] = useState(null);
    const [loading, setLoading] = useState(true);

    const backToHoliday = () => navigate('/Holidays');

    useEffect(() => {
        if (id) fetchHolidayDataByID();
    }, [id]);

    const fetchHolidayDataByID = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/FetchholidayDataBYID/${id}`);
            setHolidayData(response.data);
        } catch (error) {
            console.error('Error fetching holiday details:', error);
            toast.error("Failed to fetch holiday details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (holidayDatabyid) {
            setHolidayName(holidayDatabyid.name);
            setHolidayStartDate(holidayDatabyid.start_date ? new Date(holidayDatabyid.start_date) : null);
            setHolidayEndDate(holidayDatabyid.end_date ? new Date(holidayDatabyid.end_date) : null);
        }
    }, [holidayDatabyid]);

    const validateField = (field, message) => {
        if (!field || (typeof field === "string" && field.trim() === "")) {
            toast.error(message);
            return false;
        }
        return true;
    };

    const handleEditHoliday = async () => {
        if (!validateField(holidayName, "Holiday Name is required!")) return;
        if (!validateField(startDate, "Start Date is required and must be a valid date!")) return;
        if (!validateField(endDate, "End Date is required and must be a valid date!")) return;

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End Date cannot be earlier than Start Date!");
            return;
        }

        const holidayData = {
            holidayName: holidayName.trim(),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };

        try {
            await axios.post(`${backendUrl}/api/editholiday/${id}`, holidayData, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast.success("Holiday updated successfully!", { position: "top-right", autoClose: 5000 });

            setTimeout(() => navigate('/Holidays', { state: { successMessage: 'Holiday updated successfully!' } }), 500);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update holiday');
        }
    };

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <div className="loader-content">
                        <img src={logo} alt="Loading..." className="logo-loader" />
                        <PropagateLoader color="#3498db" size={10} />
                    </div>
                </div>
            ) : (
                <div className="dashbord-container">
                    <div className="row dashbord-list">
                        <div className="heading-text personal-info-text">
                            <h3>Edit Holiday</h3>
                            <i className="fa fa-backward fc-back-icon" onClick={backToHoliday}></i>
                        </div>
                    </div>

                    <div className="row dashbord-list personal-profile">
                        <div className="stu-pro-field-div">
                            <div className="col-md-6 student-profile-field">
                                <label>Name*</label>
                                <input
                                    type="text"
                                    className="stu-pro-input-field sch-dropbtn"
                                    placeholder="Enter name"
                                    value={holidayName}
                                    onChange={(e) => setHolidayName(e.target.value)}
                                    
                                />
                            </div>
                        </div>

                        <div className="stu-pro-field-div">
                            <div className="col-md-6 student-profile-field">
                                <label>Start Date*</label>
                                <DatePicker
                                    value={startDate}
                                    placeholder="Select Start Date"
                                    onChange={(date) => setHolidayStartDate(date)}
                                    format="MM/dd/yyyy"
                                    
                                />
                            </div>

                            <div className="col-md-6 student-profile-field">
                                <label>End Date*</label>
                                <DatePicker
                                    value={endDate}
                                    placeholder="Select End Date"
                                    onChange={(date) => setHolidayEndDate(date)}
                                    format="MM/dd/yyyy"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="save-student-btn" onClick={handleEditHoliday}>Save Holiday</div>
                    <ToastContainer />
                </div>
            )}
        </>
    );
};

export default EditHoliday;

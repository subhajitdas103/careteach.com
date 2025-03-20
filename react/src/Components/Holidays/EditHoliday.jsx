import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from 'rsuite';
import { toast, ToastContainer } from 'react-toastify';

const EditHoliday = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [holidayDatabyid, SetHolidayData] = useState(null);
    const [holidayName, setHolidayName] = useState('');
    const [startDate, setHolidayStartDate] = useState(null);
    const [endDate, setHolidayEndDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const backToHoliday = () => navigate('/Holidays');

    const validateField = (field, fieldName) => {
        if (!field) {
            toast.error(`Please Enter ${fieldName}!`);
            return false;
        }
        return true;
    };

    // const handeleditHoliday = async () => {
    //     if (!validateField(holidayName, 'Holiday Name')) return;
    //     if (!validateField(startDate, 'Start Date')) return;
    //     if (!validateField(endDate, 'End Date')) return;

    //     const formattedStartDate = startDate.toLocaleDateString('en-CA');
    //     const formattedEndDate = endDate.toLocaleDateString('en-CA');

    //     const holidayData = {
    //         holidayName,
    //         startDate: formattedStartDate,
    //         endDate: formattedEndDate,
    //     };

    //     try {
    //         await axios.post(`${backendUrl}/api/editholiday/${id}`, holidayData, {
    //             headers: { 'Content-Type': 'application/json' },
    //         });

    //         toast.success("Holiday updated successfully!", { position: "top-right", autoClose: 5000 });

    //         setTimeout(() => navigate('/Holidays', { state: { successMessage: 'Holiday updated successfully!' } }), 500);

    //     } catch (error) {
    //         console.error('Error:', error);
    //         toast.error(error.response?.data?.message || 'Failed to update holiday');
    //     }
    // };
    const handeleditHoliday = async () => {
        if (!holidayName || holidayName.trim() === "") {
            toast.error("Holiday Name is required!");
            return;
        }
    
        if (!startDate || isNaN(new Date(startDate).getTime())) {
            toast.error("Start Date is required and must be a valid date!");
            return;
        }
    
        if (!endDate || isNaN(new Date(endDate).getTime())) {
            toast.error("End Date is required and must be a valid date!");
            return;
        }
    
        // Convert to Date objects for comparison
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Validate if End Date is before Start Date
        if (start > end) {
            toast.error("End Date cannot be earlier than Start Date!");
            return;
        }
    
        // Format dates in 'YYYY-MM-DD' format
        const formattedStartDate = start.toISOString().split('T')[0];
        const formattedEndDate = end.toISOString().split('T')[0];
    
        const holidayData = {
            holidayName: holidayName.trim(),
            startDate: formattedStartDate,
            endDate: formattedEndDate,
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
    


    console.log("Fetching data for id:", id);

    const FetchholidayDataBYID = async () => {
        setLoading(true);
        console.log("Fetching data for id:", id); // Debugging
        try {
            const response = await axios.get(`${backendUrl}/api/FetchholidayDataBYID/${id}`);
            console.log("Fetched Data:", response.data); // Debugging
            SetHolidayData(response.data);
        } catch (error) {
            console.error('Error fetching holiday details:', error);
            toast.error("Failed to fetch holiday details.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (id) FetchholidayDataBYID();
    }, [id]);

// useEffect(() => {
// if (holidayDatabyid) {
//     setHolidayName(holidayDatabyid.name); // Set the holiday name
//     setHolidayStartDate(holidayDatabyid.start_date); // Set the start date
//     setHolidayEndDate(holidayDatabyid.end_date); // Set the end date
// }
// }, [holidayDatabyid]);
useEffect(() => {
    if (holidayDatabyid) {
        setHolidayName(holidayDatabyid.name);
        setHolidayStartDate(holidayDatabyid.start_date ? new Date(holidayDatabyid.start_date) : null);
        setHolidayEndDate(holidayDatabyid.end_date ? new Date(holidayDatabyid.end_date) : null);
    }
}, [holidayDatabyid]);


const handelHolidayNameChange = (e) => {
    setHolidayName(e.target.value);
  };
//   const handelHolidayStartDateChange = (e) => {
//     setHolidayStartDate(e.target.value);
//   };
const handelHolidayStartDateChange = (date) => {
    setHolidayStartDate(date);
};
//   const handelHolidayEndDateChange = (e) => {
//     setHolidayEndDate(e.target.value);
//   };
const handelHolidayEndDateChange = (date) => {
    setHolidayEndDate(date);
};
// console.log("ffff",holidayName);

// console.log("j");

    return (
        <>


            <header>
                <div className="dashbord-container">
                    <div className="row dashbord-list">
                        <div className="heading-text personal-info-text">
                            <h3>Basic Information</h3>
                            <i className="fa fa-backward fc-back-icon" onClick={backToHoliday}></i>
                        </div>
                    </div>

                    <div className="row dashbord-list personal-profile">
                        <div className="stu-pro-field-div">
                            <div className="col-md-6 student-profile-field">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="stu-pro-input-field sch-dropbtn"
                                    placeholder="Enter name"
                                    value={holidayName}
                                    onChange={handelHolidayNameChange}
                                />
                            </div>
                        </div>

                        <div className="stu-pro-field-div">
                            <div className="col-md-6 student-profile-field">
                                <label>Start Date:</label>
                                <DatePicker
                                    value={startDate}
                                    placeholder="Select start date"
                                    onChange={handelHolidayStartDateChange}
                                />
                            </div>

                            <div className="col-md-6 student-profile-field">
                                <label>End Date:</label>
                                <DatePicker
                                    value={endDate}
                                    placeholder="Select end date"
                                    onChange={handelHolidayEndDateChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="save-student-btn" onClick={handeleditHoliday}>Save Holiday</div>
                    <ToastContainer />
                </div>
            </header>
        </>
    );
};

export default EditHoliday;

import React, { useState, useEffect } from "react"; 
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import {InputAdornment } from "@mui/material";
import { TextField, FormControl, InputLabel, Select, MenuItem ,Box } from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams
import "./Students.css";
import { toast , ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; 
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css"; 
const AssignProviders = () => {
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { id } = useParams();

  const [studentDetails, setStudentDetails] = useState(null);
  const [StudentServices, setStudentServices] = useState([]);
  const [parentsDetails, setParentsDetails] = useState(null);
  const [selectedAssignProvider, setSelectedAssignProvider] = useState("");
  const [inputRateAssignProvider, setInputRateAssignProvider] = useState("");
  const [selectedAssignProviderLocation, setSelectedAssignProviderLocation] = useState("");
  const [selectedAssignProviderService, setSelectedAssignProviderService] = useState("");
  const [inputWklyHoursAssignProvider, setinputWklyHoursAssignProvider] = useState("");
  const [inputYearlyHoursAssignProvider, setInputYearlyHoursAssignProvider] = useState("");
  const [assignProviderStartDate, setAssignProviderStartDate] = useState(null);
  const [assignProviderEndDate, setAssignProviderEndDate] = useState(null);
  const [AssignproviderAutoID, SetAssignproviderAutoID] = useState(null);
  console.log("AssignproviderAutoID",AssignproviderAutoID);
  const resetFormData = () => {
    setSelectedAssignProvider(''); // Reset the selected provider
    setInputRateAssignProvider(''); // Reset the rate
    setSelectedAssignProviderService(''); // Reset service selection
    setSelectedAssignProviderLocation(''); // Reset location selection
    setinputWklyHoursAssignProvider(''); // Reset weekly hours
    setInputYearlyHoursAssignProvider(''); // Reset yearly hours
    setAssignProviderStartDate(null); // Reset start date
    setAssignProviderEndDate(null); // Reset end date
  };
// After Modal close of Assign provider , Reset all data in modal


//   -------------------Fetch Student Details -----------------

  const fetchStudentDetails = async () => {

    try {
      const response = await fetch(`${backendUrl}/api/StudentDataFetchAsID/${id}`);
      const data = await response.json();
      console.log("API Response:", data); 

      if (data.student) setStudentDetails(data.student);
      if (data.Parents) setParentsDetails(data.Parents);
      if (data.StudentServices) setStudentServices(data.StudentServices);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  // useEffect(() => {
  //   console.log("Updated studentDetails:", studentDetails);
  // }, [studentDetails]); // Runs when `studentDetails` updates
  

// ===========================================
console.log("studentDetails",studentDetails);

const [Student_start_end_date, setStudentStartEndDate] = useState(null);
const [editingServiceId, setEditingServiceId] = useState(null);
const fetch_start_end_date_of_student = async (id) => {
  try {
    const response = await fetch(`${backendUrl}/api/fetch_start_end_date_of_student/${id}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      setStudentStartEndDate(data); // Ensure data is set correctly
    } else {
      console.error("Unexpected response format:", data);
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

useEffect(() => {

  fetch_start_end_date_of_student(id);
}, []);
console.log("Hours",Student_start_end_date);
//-----------Start-----------Fetch  AssgniedProvider data------------
const [assignedProviders, setAssignedProviders] = useState([]);
const [AssignProviderID, setAssignProviderID] = useState(null);
const fetchAssignedProviderDetails = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/FetchAssignedProviders/${id}`);
      const data = await response.json();
      setAssignedProviders(data);
    
      console.log("API Response Assigned:", data);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    }
  };
  
  useEffect(() => {
    fetchAssignedProviderDetails();
  }, [id]);
// ======================================================================================
 
  
  
//   -----------End-------,----------Fetch Assigned data to Show--------------------------------------
const validServices = ['SEIT', 'SETSS', 'PT', 'OT', 'SPEECH', 'HEALTH PARA', 'COUNSELING'];

let MAX_WEEKLY_HOURS = 0;
let MAX_YEARLY_HOURS = 0;
let AssignProviderLimitEndDate = null;
let AssignProviderLimitStartDate = null;

console.log("selectedAssignProviderService", selectedAssignProviderService);

// Ensure Student_start_end_date is an array and find the matching service type
const selectedService = Array.isArray(Student_start_end_date) 
    ? Student_start_end_date.find(service => service.service_type === selectedAssignProviderService) 
    : null;

if (selectedService && validServices.includes(selectedAssignProviderService)) {
    MAX_WEEKLY_HOURS = Number(selectedService.weekly_mandate) || 0;
    MAX_YEARLY_HOURS = Number(selectedService.yearly_mandate) || 0;
  
    console.log("Max Yearly Hours:", MAX_YEARLY_HOURS);

    const formatDate = (date) => {
        if (!date || isNaN(new Date(date).getTime())) return null;
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    AssignProviderLimitEndDate = formatDate(selectedService.end_date);
    AssignProviderLimitStartDate = formatDate(selectedService.start_date);


    // ========================================

    
}




console.log("End AssignProviderLimitEndDate:", AssignProviderLimitEndDate);
console.log("Start AssignProviderLimitStartDate:", AssignProviderLimitStartDate);

// Ensure assignedProviders is an array
const assignedProvidersArray = Array.isArray(assignedProviders) 
  ? assignedProviders 
  : Object.values(assignedProviders || {}); // Avoid errors if null/undefined

console.log("Converted assignedProvidersArray:", assignedProvidersArray);
const [providerSelectedID, full_name] = selectedAssignProvider.split("|");
console.log("providerSelectedID",providerSelectedID);


const get_yearlyHouresafterAssign = () => {

  const filteredProviders = assignedProvidersArray.filter(
    provider => provider.service_type === selectedAssignProviderService 
    &&
    provider.provider_id == providerSelectedID // Ensure correct type comparison
  );
  console.log("Filtered Providers:", filteredProviders);

 const totalYearlyHours = filteredProviders.reduce(
  (sum, provider) => sum + (parseInt(provider.yearly_hours, 10) || 0), 
  0
);
console.log("Total yearly hours for provider", totalYearlyHours);
  return totalYearlyHours;
};
// ============================================================
const getRemainingYearlyHoursinEdit = () => {
  // Filter providers with the same service type but exclude the current provider
  const filteredProviders = assignedProvidersArray.filter(
    provider => provider.service_type === selectedAssignProviderService &&
                provider.id !== AssignproviderAutoID // Exclude the current provider
  );
  console.log("Filtered Providers:", filteredProviders);
  if (filteredProviders.length === 0) {
    console.log("No matching provider found.");
    return MAX_YEARLY_HOURS; // Return 0 if no provider is found
  }

  const totalYearlyHours = filteredProviders.reduce((sum, provider) => sum + parseFloat(provider.yearly_hours || 0), 0);
  console.log("totalYearlyHourstotalYearlyHours",totalYearlyHours);

  const remainingYearlyHours = MAX_YEARLY_HOURS - totalYearlyHours;

  console.log("Total Yearly Hours (excluding current provider):", remainingYearlyHours);
  return remainingYearlyHours;
};

console.log("assignedProviders333333",assignedProviders);

console.log("assignedProvidersfffff",assignedProviders);
// ==============================================================================================================
const getRemainingYearlyHoursinAdd = () => {
  const filteredProviders = assignedProviders.filter(
    provider => provider.service_type === selectedAssignProviderService
  );

  console.log("Filtered Providers:", filteredProviders.length, filteredProviders);

  if (filteredProviders.length === 0) {
    console.log("No matching provider found.");
    return MAX_YEARLY_HOURS;
  }

  console.log("MAX_YEARLY_HOURS:", MAX_YEARLY_HOURS);

  const totalYearlyHours = filteredProviders.reduce(
    (sum, provider) => sum + (Number(provider.yearly_hours) || 0), 0
  );

  console.log("Summing yearly hours:", filteredProviders.map(p => p.yearly_hours));
  console.log("Total calculated yearly hours:", totalYearlyHours);

  const remainingHourswhenAssign = MAX_YEARLY_HOURS - totalYearlyHours;
  console.log("Remaining yearly hours:", remainingHourswhenAssign);

  return remainingHourswhenAssign;
};


console.log("Remaining Yearly Hours:", getRemainingYearlyHoursinAdd());
//===========================================

const handleHoursChange = (type, e) => {
  let value = Number(e.target.value);
  const totalYearlyHours = get_yearlyHouresafterAssign(); // Get already assigned yearly hours
console.log("totalYearlyHours",totalYearlyHours);
  let maxLimit = 0;

  if (type === 'yearly') {
    maxLimit = MAX_YEARLY_HOURS;
  }

  if (type === 'yearly') {
    setInputYearlyHoursAssignProvider(value.toString());
  }

  // For 'weekly', update state directly without limit check
  if (type === 'weekly') {
    setinputWklyHoursAssignProvider(value.toString());
  }
};

const remainingHours = getRemainingYearlyHoursinEdit();
console.log("remainingHours",remainingHours);

const remainingHoursWhenAssign =   getRemainingYearlyHoursinAdd();
console.log("remainingHoursWhenAssign",remainingHoursWhenAssign);

const FormatassignPStartDate = assignProviderStartDate 
? new Date(assignProviderStartDate).toLocaleDateString('en-CA') 
: null;
const FormatassignPEndDate = assignProviderEndDate 
? new Date(assignProviderEndDate).toLocaleDateString('en-CA') 
: null;

console.log("Max Weekly Hours:", MAX_WEEKLY_HOURS);
console.log("End AssignProviderLimitEndDate:", AssignProviderLimitEndDate);
console.log("Start AssignProviderLimitStartDate:", AssignProviderLimitStartDate);
console.log("assignProviderStartDate",FormatassignPStartDate);
console.log("assignProviderEndDate",FormatassignPEndDate);
// --------------------------------------------------------------------------------
const disableInvalidDates = (date) => {
  const startDate = new Date(AssignProviderLimitStartDate);
  const endDate = new Date(AssignProviderLimitEndDate);

  // Set the time to midnight to ignore time in the comparison
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // console.log("nnnnnnnnnnn",startDate, endDate); 
  // Check if the date is within the range
  return date >= startDate && date <= endDate;
};
//   ----------------Saved Assign Provider Data-----------------------

const handelAssignProviderData = async () => {
  console.log("handleAssignProvider triggered");

  if (!selectedAssignProvider) {
    toast.error('Please Select a Provider!');
    return;
  }

  const [providerId, full_name] = selectedAssignProvider.split('|') || [];
  if (!providerId) {
    toast.error('Invalid Provider Selected!');
    return;
  }

  const FormatassignProviderStartDate = assignProviderStartDate 
    ? new Date(assignProviderStartDate).toLocaleDateString('en-CA') 
    : null;
  const FormatassignProviderEndDate = assignProviderEndDate 
    ? new Date(assignProviderEndDate).toLocaleDateString('en-CA') 
    : null;

  console.log("providerId", providerId);
  console.log("assignedProviders", assignedProviders);

  // Validation checks
  const requiredFields = {
    "Rate": inputRateAssignProvider,
    "Service": selectedAssignProviderService,
    "Location": selectedAssignProviderLocation,
    "Weekly Hours": inputWklyHoursAssignProvider,
    "Yearly Hours": inputYearlyHoursAssignProvider,
    "Start Date": assignProviderStartDate,
    "End Date": assignProviderEndDate
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      console.error(`Validation failed: Missing ${field}`);
      toast.error(`Please enter ${field}!`);
      return;
    }
  }

  const startDate = new Date(assignProviderStartDate);
  const endDate = new Date(assignProviderEndDate);

  if (startDate > endDate) {
    console.error("Validation failed: Start date is later than end date");
    toast.error('Start date cannot be later than the end date!');
    return;
  }
  if (parseFloat(inputWklyHoursAssignProvider) > parseFloat(inputYearlyHoursAssignProvider)) {
    toast.error('Weekly hours cannot be greater than yearly hours!');
    return;
  }

  
  console.log("rateData", ProviderDataAssignProvider);

  if (Array.isArray(ProviderDataAssignProvider)) {
    console.log("Available provider IDs in rateData:", ProviderDataAssignProvider.map(p => p.id));

    const rate_check = ProviderDataAssignProvider.some(provider => {
      const providerRate = provider.rate;
      const providerID = Number(provider.id);
      const checkProviderId = Number(providerId);

      if (providerID === checkProviderId) {
        console.log(`Comparing Provider ID: ${providerID} with ${checkProviderId} | Rate: ${providerRate} with ${inputRateAssignProvider}`);

        if (Number(inputRateAssignProvider) > providerRate) {
          console.error("Validation failed: Input rate exceeds provider rate");
          toast.error(`Input rate exceeds provider rate: ${providerRate}`);
          return true;
        }
        return Number(inputRateAssignProvider) > providerRate;

      }
      return false;
    });

    if (rate_check) {
      console.log("Rate validation failed, stopping execution.");
      return;
    }
  }

  // Check for duplicate providers
  let isDuplicate = false;
  if (Array.isArray(assignedProviders)) {
    console.log("Existing assignedProviders:", assignedProviders);

    isDuplicate = assignedProviders.some(provider => {
      const providerIdStr = String(provider.provider_id).trim();
      const selectedProviderIdStr = String(providerId).trim();
      const providerService = provider.service_type.trim();
      const selectedService = selectedAssignProviderService.trim();

      const normalizeDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };

      const providerStartDate = normalizeDate(provider.start_date);
      const selectedStartDate = normalizeDate(assignProviderStartDate);

      const providerEndDate = normalizeDate(provider.end_date);
      const selectedEndDate = normalizeDate(assignProviderEndDate);

      console.log(`Comparing provider_id: ${providerIdStr} with ${selectedProviderIdStr}`);
      console.log(`Comparing service_type: ${providerService} with ${selectedService}`);
      console.log(`Comparing start_date: ${providerStartDate} with ${selectedStartDate}`);
      console.log(`Comparing end_date: ${providerEndDate} with ${selectedEndDate}`);

      if (
        providerIdStr === selectedProviderIdStr &&
        providerService === selectedService &&
        providerStartDate === selectedStartDate &&
        providerEndDate === selectedEndDate
      ) {
        console.error("Validation failed: Duplicate provider entry");
        toast.error('For This Provider, This Service already Taken, So, Please Change The Date!');
        return true;
      }

      if (providerIdStr === selectedProviderIdStr && providerService !== selectedService) {
        toast.error('This provider already has a service assigned. You cannot assign a different service.');
        return true;
      }


    
      // const selectedStart = new Date(selectedStartDate);
      // const selectedEnd = new Date(selectedEndDate);
      
      // // Step 1: Filter and sort services by start date
      // const filteredServices = assignedProviders
      //     .filter(service => service.provider_id == selectedProviderIdStr && service.service_type === selectedService)
      //     .map(service => ({
      //         start: new Date(service.start_date),
      //         end: new Date(service.end_date)
      //     }))
      //     .sort((a, b) => a.start - b.start);
      //     console.log("Filtered Services for Provider:", selectedProviderIdStr, filteredServices);
      // // Step 2: Check for direct overlaps
      // const isOverlap = filteredServices.some(service => 
      //     // selectedStart < service.end && selectedEnd >service.start
      //     // selectedEnd > service.start && selectedStart < service.end && service.start !== selectedEnd
      //     selectedStart < service.end && selectedEnd > service.start
         
      // );
      
      // if (isOverlap) {
      //     console.log("Invalid selection ❌ - Overlap detected!");
      //     toast.error("This Date is occupied. Choose a non-overlapping period.");
      //     return true;
      // }
      
      // Step 3: Check for available gaps
    //   let canAssign = false;
    //   let lastEnd = null;
      
    //   for (const service of filteredServices) {
    //       const currentStart = service.start;
      
    //       if (lastEnd !== null) {
    //           if (selectedStart >= lastEnd && selectedEnd <= currentStart) { // Allow exact fits
    //               canAssign = true;
    //               break;
    //           }
    //       } else {
    //           // If the selected range starts before the first service
    //           if (selectedEnd <= currentStart) {
    //               canAssign = true;
    //               break;
    //           }
    //       }
      
    //       lastEnd = service.end;
    //   }
      
    //   // Allow scheduling after the last assigned service
    //   if (!canAssign && (lastEnd === null || selectedStart >= lastEnd)) {
    //       canAssign = true;
    //   }
      
    //   if (!canAssign) {
    //       console.log("Invalid selection ❌ - No available gap!");
    //       toast.error("This Date is occupied. You can only assign within available gaps.");
    //       return true;
    //   }
      
    //   console.log("Valid selection ✅ - Slot is available!");
    //   return false;
      
  
     

      return false;
    });

    if (isDuplicate) {
      console.log("Duplicate detected, stopping execution.");
      return;
    }
  }

  // Proceed to API call if no errors
  const formData = {
    id,
    selectedProviderId: providerId,
    full_name,
    inputRateAssignProvider,
    selectedAssignProviderLocation,
    selectedAssignProviderService,
    inputWklyHoursAssignProvider,
    inputYearlyHoursAssignProvider,
    assignProviderStartDate: FormatassignProviderStartDate,
    assignProviderEndDate: FormatassignProviderEndDate,
  };

  console.log("Final validation passed, proceeding to API call...");
  console.log("FormData:", formData);
// Check yearly hours before submission
const remainingYearlyHours = getRemainingYearlyHoursinAdd();
if (inputYearlyHoursAssignProvider > remainingYearlyHours) {
  toast.error(`Cannot assign more than ${remainingYearlyHours} yearly hours.`, { position: "top-right", autoClose: 5000 });
  return; // Stop execution
}
  try {
    const response = await axios.post(`${backendUrl}/api/AssignProvider`, JSON.stringify(formData), {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Data sent successfully:', response.data);

    fetchAssignedProviderDetails();
    setIsModalOpen(false);
    setTimeout(() => {
      toast.success("Provider assigned successfully", { position: "top-right", autoClose: 5000 });
    }, 500);
  } catch (error) {
    if (error.response) {
      // Handle Laravel validation errors
      if (error.response.status === 400 && error.response.data.error) {
        toast.error(error.response.data.error, { position: "top-right", autoClose: 5000 });
        return; // Stop execution
      } else if (error.response.data.errors) {
        // Laravel validation errors (multiple fields)
        Object.values(error.response.data.errors).forEach((errorMsg) => {
          toast.error(errorMsg[0], { position: "top-right", autoClose: 5000 });
        });
        return;
      } else {
        toast.error("An unexpected error occurred", { position: "top-right", autoClose: 5000 });
        return; // Stop execution
      }
    } else {
      toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 5000 });
      return; // Stop execution
    }
    try {
      const fetchResponse = await fetch(`${backendUrl}/api/AssignProvider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const fetchData = await fetchResponse.json();
      console.log("Fetch response:", fetchData);

      fetchAssignedProviderDetails();
      setIsModalOpen(false);
      setTimeout(() => {
        toast.success("Provider assigned successfully (via fetch)", { position: "top-right", autoClose: 5000 });
      }, 500);
    } catch (fetchError) {
      console.error("Error during fetch request:", fetchError);
    }
  }
};


// ====================================
const AssignProviderEditID = selectedAssignProvider.split("|")[0];




// =================Edit Assign Provider=========================

const [AssignEditID, setAssignID] = useState("");

// console.log("AssignEditID",AssignEditID);


console.log("AssignProviderEditID",AssignProviderEditID);
const handleAssignProviderDataEdit = async () => {
  console.log("handleAssignProvider triggered");

  if (!selectedAssignProvider) {
    toast.error("Please Select a Provider!");
    return;
  }

  const [providerId, full_name] = selectedAssignProvider.split("|");
  console.log("selectedAssignProvider",providerId);
  const startDate = new Date(assignProviderStartDate);
  const endDate = new Date(assignProviderEndDate);
  if (startDate > endDate) {
    toast.error("Start date cannot be later than the end date!");
    return;
  }

  // Required Fields Validation
  const requiredFields = [
    { value: inputRateAssignProvider, message: "Please Enter Rate!" },
    { value: selectedAssignProviderService, message: "Please Select a Service!" },
    { value: selectedAssignProviderLocation, message: "Please Select a Location!" },
    { value: inputWklyHoursAssignProvider, message: "Please Enter Weekly Hours!" },
    { value: inputYearlyHoursAssignProvider, message: "Please Enter Yearly Hours!" },
    { value: assignProviderStartDate, message: "Please Select a Start Date!" },
    { value: assignProviderEndDate, message: "Please Select an End Date!" },
  ];

  for (const field of requiredFields) {
    if (!field.value) {
      toast.error(field.message);
      return;
    }
  }

  const formattedStartDate = startDate.toLocaleDateString("en-CA");
  const formattedEndDate = endDate.toLocaleDateString("en-CA");


  if (Array.isArray(ProviderDataAssignProvider)) {
    const rate_check = ProviderDataAssignProvider.some((provider) => {
      if (Number(provider.id) === Number(providerId)) {
        if (Number(inputRateAssignProvider) > provider.rate) {
          toast.error(`Input rate exceeds provider rate ${provider.rate}`);
          return true;
        }
      }
      return false;
    });

    if (rate_check) return;
  } else {
    console.error("rateData is not an array:", ProviderDataAssignProvider);
  }
  const formData = {
    id,
    providerId,
    full_name,
    inputRateAssignProvider,
    selectedAssignProviderLocation,
    selectedAssignProviderService,
    inputWklyHoursAssignProvider,
    inputYearlyHoursAssignProvider,
    assignProviderStartDate: formattedStartDate,
    assignProviderEndDate: formattedEndDate,
  };

  console.log("Form data of assign Provider Modal:", formData);

  const remainingYearlyHours = getRemainingYearlyHoursinEdit();
  if (inputYearlyHoursAssignProvider > remainingYearlyHours) {
    toast.error(`Cannot assign more than ${remainingYearlyHours} yearly hours.`, { position: "top-right", autoClose: 5000 });
    return; // Stop execution
  }

  try {
    const response = await axios.post(
      `${backendUrl}/api/UpdateAssignProvider/${AssignEditID}`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    fetchAssignedProviderDetails();
    setIsModalOpenofAssignProvider(false);

    setTimeout(() => {
      toast.success("Assigned provider updated successfully", { position: "top-right", autoClose: 5000 });
    }, 500);

    console.log("Data sent successfully:", response.data);
  } catch (error) {


    if (error.response) {
      // Handle Laravel validation errors
      if (error.response.status === 400 && error.response.data.error) {
        toast.error(error.response.data.error, { position: "top-right", autoClose: 5000 });
        return; // Stop execution
      } else if (error.response.data.errors) {
        // Laravel validation errors (multiple fields)
        Object.values(error.response.data.errors).forEach((errorMsg) => {
          toast.error(errorMsg[0], { position: "top-right", autoClose: 5000 });
        });
        return;
      } else {
        toast.error("An unexpected error occurred", { position: "top-right", autoClose: 5000 });
        return; // Stop execution
      }
   
    }
  }
};


//   =================Modal Open==================

// ========================================

  const [ProviderDataAssignProvider, setProviderData] = useState(null);

  const fetchProviderData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/ViewProviders`);
        const data = await response.json();
        console.log("API Response Provider Data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setProviderData(data);
        } else {
          console.log("No providerData in response.");
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      }
    };
    useEffect(() => {
      fetchProviderData();
    }, []);
  //   -----------End------------------Fetch Provider data--------------------------------------

    // ==============Back Button============
    const navigate = useNavigate();
    const backToStudent = () => {
        navigate('/students');
      };


   const [show, setShow] = useState(false);
   const [selectedStudent, setSelectedStudent] = useState("");

   const AssignedProviderDelete = (id) => {
    setSelectedStudent(id);
    setShow(true); // Opens the modal
    
  };

  const handleClose = () => {
    setShow(false);  // Closes the modal
  };

// ==========Delete Assigned Providers================

const DeleteAssignBTN = () => {
  console.log("Attempting to delete provider with ID:", selectedStudent);

  axios.delete(`${backendUrl}/api/DeleteAssignedProviders/${selectedStudent}`)
    .then((response) => {
      console.log('Provider deleted successfully:', response.data);
      fetchAssignedProviderDetails();
      setShow(false);
      toast.success("Service successfully Deleted!", {
                  position: "top-right", 
                  autoClose: 5000,
                });
    })
    .catch((error) => {
      if (error.response) {
        console.error('Error deleting provider (response):', error.response);
      } else if (error.request) {
        console.error('Error deleting provider (request):', error.request);
      } else {
        console.error('Error deleting provider (message):', error.message);
      }
    });
};


const [isModalOpen, setIsModalOpen] = useState(false);
const [isModalOpenofEditAssignProvider, setIsModalOpenofAssignProvider] = useState(false);
const openModal = () => {
  setIsModalOpen(true);   // Open the modal
  resetFormData();        // Reset all the form data
};

const closeModal = () => {
  setIsModalOpenofAssignProvider(false);
  setIsModalOpen(false)
  resetFormData();
};

// =====================Edit of Assign Provider Modal==============================

    const closeModalofAssignProvider = () => {
      setIsModalOpenofAssignProvider(false);
      resetFormData();
    };
    const AssignedProviderEdit = (id) => {
      SetAssignproviderAutoID(id);
      setEditingServiceId(id);
      const providerDetails = assignedProviders.find((provider) => provider.id === id);
    // console.log("uegf",providerDetails.service_type);
      if (providerDetails) {
       setSelectedAssignProvider(`${providerDetails.provider_id}|${providerDetails.provider_name}`);
       setAssignID(providerDetails.id);
        setInputRateAssignProvider(providerDetails.provider_rate);
        setSelectedAssignProviderLocation(providerDetails.location);
        setSelectedAssignProviderService(providerDetails.service_type);
        setAssignProviderStartDate(providerDetails.start_date);
        setAssignProviderEndDate(providerDetails.end_date);
        setinputWklyHoursAssignProvider(providerDetails.wkly_hours );
        setInputYearlyHoursAssignProvider(providerDetails.yearly_hours );
        setIsModalOpenofAssignProvider(true);
      } else {
        console.error("Provider not found for ID:", id);
        alert("Provider details not found!");
      }
    };
    
// ==================================================

const [selectedProviderId, setSelectedProviderId] = useState(null);
const openModalAssignProvider = (id, name) => {
  setIsModalOpen(true); // Open the modal
  setSelectedProviderId(id); // Set the selected provider ID
  resetFormData();
};
  useEffect(() => {
  }, [assignProviderStartDate]);
// ================================================
// useEffect(() => {
//   setInputYearlyHoursAssignProvider(""); // Reset Yearly Hours when service type changes
// }, [selectedAssignProviderService]);

console.log("cccccccccccccccc",assignedProviders);
  return (
<div>
    <ToastContainer />
    <div className="dashbord-container">
      <div className="row dashbord-list">
        <div className="heading-text">
          
        <h3>Services and Provider for - {studentDetails?.first_name} {studentDetails?.last_name}</h3>

            <div onClick={backToStudent}>
                <i className="fa fa-backward fc-back-icon" aria-hidden="true" id="back_student_click"></i>
            </div>


        </div>
        <table className="table bdr table-add-provider" border="1">
          <thead className="bg-red">
          </thead>
        </table>
      </div>

    


      <div className="add-student-btn" onClick={() => openModalAssignProvider(id)}>
        <i className="fa fa-user-plus add-student-icon"></i> Assign a Provider
      </div>

      <div className="tbl-container bdr tbl-container-student">
        <table className="table bdr table-add-provider" border="1">
          <thead className="bg-red">
            <tr>
              <th>PROVIDER</th>
              <th>SERVICE TYPE</th>
              <th>WEEKLY HRS</th>
              <th>YEARLY HRS</th>
              <th>START DATE</th>
              <th>END DATE</th>
              <th>LOCATION</th>
              <th>RATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
                <tbody>
                 {assignedProviders.length > 0 ? (
                    assignedProviders.map((provider, index) => (
                    <tr key={index}>
                        <td>{provider.provider_name}</td>
                        <td>{provider.service_type}</td>
                        <td>{provider.wkly_hours}</td>
                        <td>{provider.yearly_hours}</td>
                        <td>{new Date(provider.start_date).toLocaleDateString("en-US")}</td>
                        <td>{new Date(provider.end_date).toLocaleDateString("en-US")}</td>
                        <td>{provider.location}</td>
                        <td>{provider.provider_rate}</td>
                        <td>
                        <div className="status-area">
                            <button onClick={() => AssignedProviderEdit(provider.id)}
                            style={{ backgroundColor: 'white', display: 'inline-block' }}
                            title="Edit Assigned Provider"
                            >
                            <i className = "fa fa-edit fa-1x fa-icon-img" alt="Edit" style={{ width: '48px', marginLeft: '2px' }} />
                            </button>

                            <button onClick={() => AssignedProviderDelete(provider.id)}
                            style={{ backgroundColor: 'white', display: 'inline-block' , width:'16px'}}
                            title="Delete Assigned Provider"
                            >
                            <i className="fa fa-trash fa-1x fa-icon-img" alt="Delete" style={{ width: '48px', marginLeft: '-7px' }} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                    ) : (
                    <tr>
                    <td colSpan="9" className="text-center">No Service Available</td>
                    </tr>
                    )}
                </tbody>

        </table>
      </div>

       {/* Modal for Assigning Provider */}
       {isModalOpen && (
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}>
          
        <Modal.Dialog>
          <Modal.Header closeButton onClick={closeModal}>
            <Modal.Title>Assign Provider</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <div className="form-row">
              <div className="col-12 col-md-12">
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <Box sx={{ backgroundColor: "red", display: "inline-block", padding: "2px 5px" }}>
                <InputLabel id="provider-select-label">Select Provider</InputLabel>
              </Box>
                <Select
                    labelId="provider-select-label"
                    id="provider-select"
                    value={selectedAssignProvider}
                    
                    onChange={(e) => {
                      const [id, name] = e.target.value.split('|'); // Split the concatenated value
                      setSelectedAssignProvider(e.target.value);   // Update the full `id|name` in state
                      setSelectedProviderId(id);                   // Store the provider ID
                    }}
                >
                    {ProviderDataAssignProvider && ProviderDataAssignProvider.length > 0 ? (
                      ProviderDataAssignProvider.map((provider) => (
                        <MenuItem 
                          key={provider.id} 
                          value={`${provider.id}|${provider.provider_first_name} ${provider.provider_last_name}`}
                        >
                          {provider.provider_first_name} {provider.provider_last_name}
                        </MenuItem>
                      ))                  
                    ) : (
                    <MenuItem disabled>No Providers Available</MenuItem>
                    )}
                </Select>
                
                </FormControl>

              </div>
  
              <div className="col-12">
                <TextField
                  id="rate-input"
                  label="Rate"
                  variant="outlined"
                  fullWidth
                  value={inputRateAssignProvider}
                  onChange={(e) => {
                    // Allow only numeric input
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setInputRateAssignProvider(value);
                  }}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter rate"
                />
              </div>
  
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="location-select-label">Location</InputLabel>
                    <Select
                      labelId="location-select-label"
                      value={selectedAssignProviderLocation}
                      onChange={(e) => setSelectedAssignProviderLocation(e.target.value)}
                    >
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="School">School</MenuItem>
                    </Select>
                  </FormControl>
                </div>
  
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="service-select-label">Service Type</InputLabel>
                    <Select
                      labelId="service-select-label"
                      value={selectedAssignProviderService}
                      onChange={(e) => setSelectedAssignProviderService(e.target.value)}
                    >
                      {StudentServices.length > 0 ? (
                        StudentServices.map((service) => (
                          <MenuItem key={service.id} value={service.service_type}>
                            {service.service_type}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No services available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* ========================= */}
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                <TextField
                  id="weekly-input"
                  // label="Weekly Hours - Total"
                  label={`Weekly Hours Total - ${MAX_WEEKLY_HOURS} `}
                  variant="outlined"
                  fullWidth
                  value={inputWklyHoursAssignProvider}
                  // onChange={(e) => setinputWklyHoursAssignProvider(e.target.value)}
                  onChange={(e) => handleHoursChange('weekly', e)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Weekly Hours"
                />
                </div>
  

                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <TextField
                    id="yearly-input"
                    // label="Yearly Hours"
                    label={`Yearly Hours Total - ${MAX_YEARLY_HOURS} `}

                    variant="outlined"
                    fullWidth
                    value={inputYearlyHoursAssignProvider || 0}
                    onChange={(e) =>
                      handleHoursChange("yearly", { target: { value: e.target.value } })
                    }
                    style={{ marginBottom: "16px" }}
                    placeholder="Enter Yearly Hours"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">/ {remainingHoursWhenAssign}</InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              {/* ============== */}
           
              <div className="col-12 lctDropdown">
                {/* Start Date Picker */}
                <div className="col-6" style={{ paddingRight: "4px" }}>
                  <div className="datepicker-container">
                    <DatePicker
                      selected={assignProviderStartDate}
                      onChange={(date) => setAssignProviderStartDate(date)}
                      className="datepicker_Date_of_assignProvider"
                      placeholderText="Start Date"
                      filterDate={disableInvalidDates}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                  </div>
                </div>

                {/* End Date Picker */}
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <div className="datepicker-container">
                    <DatePicker
                      selected={assignProviderEndDate}
                      onChange={(date) => setAssignProviderEndDate(date)}
                      className="datepicker_Date_of_assignProvider"
                      placeholderText="End Date"
                      filterDate={disableInvalidDates}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handelAssignProviderData}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
      )}

        {/* =============Delete Assigned Provider================= */}
        {AssignedProviderDelete && (
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Assign Provider</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Are you sure you want to delete this Service {"Provider "}
                      <strong className="student-name-delete-modal">
                      </strong>
                      ?
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="delete-button" variant="danger" onClick={DeleteAssignBTN}  >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}

      {/* ==================================== */}
      {/* Edit Modal for Assigning Provider */}
       {isModalOpenofEditAssignProvider && (
      <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}>
        <Modal.Dialog>
          <Modal.Header closeButton onClick={closeModalofAssignProvider}>
            <Modal.Title>Edit of Assign Provider</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                

            <div className="form-row">
              <div className="col-12 col-md-12">
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
                <InputLabel id="provider-select-label">Select Provider</InputLabel>
                <Select
                    labelId="provider-select-label"
                    id="provider-select"
                    value={selectedAssignProvider}
                    
                    onChange={(e) => {
                      const [id, name] = e.target.value.split('|'); // Split the concatenated value
                      setSelectedAssignProvider(e.target.value);   // Update the full `id|name` in state
                      setSelectedProviderId(id);                   // Store the provider ID
                      
                    }}  
                    disabled={true}
                >
                    {ProviderDataAssignProvider.length > 0 ? (
                      ProviderDataAssignProvider.map((provider) => (
                        
                        <MenuItem 
                          key={provider.id} 
                          value={`${provider.id}|${provider.provider_first_name} ${provider.provider_last_name}`}
                        >
                          {provider.provider_first_name} {provider.provider_last_name}
                        </MenuItem>
                      ))
                    ) : (
                    <MenuItem disabled>No Providers Available</MenuItem>
                    )}
                </Select>
                </FormControl>
              </div>
  
              <div className="col-12">
                <TextField
                  id="rate-input"
                  label="Rate"
                  variant="outlined"
                  fullWidth
                  value={inputRateAssignProvider}
                  onChange={(e) => {
                    // Allow only numeric input
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setInputRateAssignProvider(value);
                  }}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter rate"
                />
              </div>
  
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="location-select-label">Location</InputLabel>
                    <Select
                      labelId="location-select-label"
                      value={selectedAssignProviderLocation}
                      onChange={(e) => setSelectedAssignProviderLocation(e.target.value)}
                      disabled={true}
                    >
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="School">School</MenuItem>
                    </Select>
                  </FormControl>
                </div>
  
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="service-select-label">Service Type</InputLabel>
                    <Select
                      labelId="service-select-label"
                      value={selectedAssignProviderService}
                      onChange={(e) => setSelectedAssignProviderService(e.target.value)}
                      disabled={true}
                    >
                      {StudentServices.length > 0 ? (
                        StudentServices.map((service) => (
                          <MenuItem key={service.id} value={service.service_type}>
                            {service.service_type}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No services available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* ========================= */}
              <div className="col-12 lctDropdown">
                <div className="col-6" style={{ paddingRight: "5px" }}>
                <TextField
                  id="weekly-input"
                  label={`Weekly Hours Total - ${MAX_WEEKLY_HOURS} `}
                  variant="outlined"
                  fullWidth
                  value={inputWklyHoursAssignProvider}
                  // onChange={(e) => setinputWklyHoursAssignProvider(e.target.value)}
                  onChange={(e) => handleHoursChange('weekly', e)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Weekly Hours"
                />
                </div>
  
                <div className="col-6" style={{ paddingLeft: "5px" }}>
                <TextField
                  id="yearly-input"
                  label={`Yearly Hours Total - ${MAX_YEARLY_HOURS} `}
                  variant="outlined"
                  fullWidth
                  // value={inputYearlyHoursAssignProvider}
                  value={inputYearlyHoursAssignProvider || "0"}
                  onChange={(e) => handleHoursChange('yearly', e)}
                  style={{ marginBottom: "16px" }}
                  placeholder="Enter Yearly Hours"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">/ {remainingHours}</InputAdornment>
                    ),
                  }}
                />
                </div>
              </div>
              {/* ============== */}
              <div className="col-12 lctDropdown">
                    <div className="col-6" style={{ paddingRight: "4px" }}>
                     <div className="datepicker-container">
                        <DatePicker
                          selected={assignProviderStartDate ? new Date(assignProviderStartDate) : null}
                          onChange={(date) => {
                            // console.log("Selected Date:", date);
                            setAssignProviderStartDate(format(date, "yyyy-MM-dd"));
                          }}
                          dateFormat="MM/dd/yyyy" 
                          className="datepicker_Date_of_assignProvider"
                          filterDate={disableInvalidDates}
                          onKeyDown={(e) => e.preventDefault()} 
                        />
                         <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                      </div>
                    </div>
               
                    <div className="col-6" style={{ paddingLeft: "5px" }}>
                        <div className="datepicker-container">
                          <DatePicker
                            selected={assignProviderEndDate}
                            onChange={(date) => setAssignProviderEndDate(date)}

                            placeholdertext="Select an end date"
                            className="datepicker_Date_of_assignProvider" 
                            filterDate={disableInvalidDates}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                          <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                        </div>
                     </div>
                 </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAssignProviderDataEdit}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
      )}
    </div>
</div>
  );
};

export default AssignProviders;

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
import { SelectPicker , ButtonToolbar } from 'rsuite';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faMinusCircle  } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import PropagateLoader from "react-spinners/PropagateLoader";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'; // Importing the plus icon
import { Modal, Button } from 'react-bootstrap'; // Importing Bootstrap Modal
import { TimePicker ,DatePicker , Form , Dropdown ,Input  } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Popover, List, ListItem,  Checkbox } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Replace with your desired theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Dropdown as PrimeReactDropdown } from 'primereact/dropdown';
import useAuth from "../../hooks/useAuth";
// import { Dropdown } from 'primereact/dropdown';
import logo from "../../Assets/logo.png"; 
// Configure the calendar to use moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
// ============Getting Roll Name from Session=========
  const { userRollID, userRollName } = useAuth(); 
  console.log("Updated Roll Name:", userRollName);
  console.log("Updated Roll ID:", userRollID); 
  // ==========End of getting RollName================
  const [startTimeUpdateConfirmSession, setStartTimeUpdateConfirmSession] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentUpdateSingleSession, setselectedStudentUpdateSingleSession] = useState(null);
  const [selectedStudentDropdown, setSelectedStudentDropdown] = useState(null);
  console.log("Selected student",selectedStudent);
  const [events, setEvents] = useState([]);
  console.log("Selected  cccccc:", selectedStudentUpdateSingleSession);
  

  const [Bulkevents, setBulkEvents] = useState([
  ]);
  const [filteredEvents, setFilteredEvents] = useState(events);

  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showModalofSession, setShowModalConfirmSession] = useState(false); 
  const [showModalofSessionSingle, setShowModalSessionUpdateSingle] = useState(false);
  const [showModalofSessionBulk, setShowModalConfirmSessionBulk] = useState(false); 
  
  const [SelectedDateConfirmSession, setSelectedDateConfirmSession] = useState(false);
  
  const handleViewChange = (viewType) => {
    
    setView(viewType);
  };
  const backtodashboard = () => {
    navigate('/dashboard');
  };
  const handleNavigate = (action) => {
    const current = new Date(currentDate);
    if (action === 'PREV') {
      current.setMonth(current.getMonth() - 1); // Move to previous month
    } else if (action === 'NEXT') {
      current.setMonth(current.getMonth() + 1); // Move to next month
    } else if (action === 'TODAY') {
      const today = new Date();
      setCurrentDate(today); // Set the current date to today
      current.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    }
    setCurrentDate(current); // Update the current date after the action
  };
  console.log("User Roll IcccccccccccD:", userRollID);
  useEffect(() => {
    if (userRollID) {
      const FetchStudentDetails = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/Studentsincalendar/${userRollID}/${userRollName}`);

          const data = response.data; // Assume the response contains data directly
          console.log("Fetched student data:", data);
  
          // Check if the response contains an array of students and has data
          if (Array.isArray(data) && data.length > 0) {
            setStudentData(data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      FetchStudentDetails();
    } else {
      console.log("User Roll ID is not available.");
    }
  }, [userRollID]); // Dependency array: the effect will run when userRollID changes
  
  // ====================Confirm Session================================
  const [confirmSession, setConfirmSession] = useState(null);

console.log("confirmSession",confirmSession);

useEffect(() => {
  const FetchConfirmSessionDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/FetchConfirmSession`);
      const data = response.data;
     
      if (Array.isArray(data)) {
        setConfirmSession(data);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  FetchConfirmSessionDetails(); // Call the function
}, []); 

// ==========================================
const [shouldFetchSingle, setShouldFetchSingle] = useState(false);
console.log("ddddddddLine 121d",confirmSession);
useEffect(() => {
  const FetchSingleSessionDetails = async () => {
    try {
      // const response = await axios.get(`${backendUrl}/api/SingleSession`);
      const response = await axios.get(`${backendUrl}/api/SingleSession/${userRollID}/${userRollName}`);

      const data = response.data; // Axios automatically parses JSON
      
      // Transform the data to match the events structure
      const formattedEvents = data.map((session) => {

       

        // if (!session) return null;
        const sessionStartTime = moment(`${session.date} ${session.start_time}`, 'YYYY-MM-DD h:mm A').toDate();

        const sessionEndTime = moment(`${session.date} ${session.end_time}`, 'YYYY-MM-DD h:mm A').toDate();
       
        const formattedStartTime = moment(session.start_time, 'HH:mm:ss').format('h:mm A');
          const formattedEndTime = moment(session.end_time, 'HH:mm:ss').format('h:mm A');


          console.log('Checking for session:', session); 
      
          console.log('Confirm Session Dates:', Array.isArray(confirmSession) ? confirmSession.map(cs => cs.date) : []);
        
 
          const isMatched = Array.isArray(confirmSession) && confirmSession.some(cs => {
            console.log('Comparing:', cs.date, 'with', session.date); // Log individual comparison
            return cs.student_id === session.student_id && cs.date === session.date;
          });
          
        const eventStyle = isMatched ? { backgroundColor: '#cb1313' } : {}; 

          const matchedData = confirmSession && Array.isArray(confirmSession)
          ? confirmSession.some(cs => 
              cs.student_id === session.student_id &&
              cs.date === session.date 
         
            )
          : false;

          

        if (matchedData) {
          console.log('Matched Data:', session);
        } else {
          console.log('No matches found for session', session);
        }

        return {
          title: `${session.student_name} - ${formattedStartTime} - ${formattedEndTime}`,
          start: sessionStartTime, // Combined Date and start_time
          end: sessionEndTime, 
          student_id :session.student_id,
          session_name: session.session_name, 
          session_date :session.date, 
          id:session.id,
          // eventClass: matchedData ? 'matched-event' : '', // Apply conditional class
          style: eventStyle,
        };
      });

      // Update state or handle events
      setEvents(formattedEvents);
      console.log("Events:", formattedEvents);

    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  FetchSingleSessionDetails();
  setShouldFetchSingle(false); 
}, [shouldFetchSingle]);


// =====================================

// ===============================

  const handleStudentSelect = (student) => {
    // const name = `${student.first_name} ${student.last_name}`;
    // setSelectedStudent(student);
    setSelectedStudentDropdown(student); // Update state with the full name
  };

  const [clickedDate, setClickedDate] = useState(null);
  // Handle the click on the plus icon
  const handlePlusClick = (date) => {
    console.log('Plus icon clicked for date:', date);
    setFormValue({ ...formValue, date });
    setClickedDate(date);
    setShowModal(true); // Show the modal when the plus icon is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  const [formValue, setFormValue] = useState({ time: null });
  console.log("dfgthy",formValue.date);
  // ===========For Single Ssson Add ============
  const [StartTimeValue, setStartTimeValue] = useState({ time: null });
  const [EndTimeValue, setEndTimeValue] = useState({ time: null });

  const handleStartimeChange = (value) => {
    const selectedStartHour = value.getHours();

    // Validate the selected start time (8 AM to 10 PM)
    if (selectedStartHour < 8 || selectedStartHour > 21) {
      alert('Start time must be start from  8:00 AM .');
      return;
    }

    // Update the start time value
    setStartTimeValue({ time: value });

    // If end time is before the start time, reset it
    if (EndTimeValue.time && value >= EndTimeValue.time) {
      setEndTimeValue({ time: null }); // Reset end time
    }
  };


   // Handle end time change
   const handleEndtimeChange = (value) => {
    const selectedEndHour = value.getHours();

    // Validate the selected end time (after start time, up to 10 PM)
    if (StartTimeValue.time && value <= StartTimeValue.time) {
      alert('End time must be later than the start time.');
      return;
    }

    // Validate the end time range (8 AM to 10 PM)
    if (selectedEndHour < 8 || selectedEndHour > 21) {
      alert('End time must be between 10:00 PM.');
      return;
    }

    // Update the end time value
    setEndTimeValue({ time: value });
  };

 
 

  // ===========For Bulk Session Add=============
  const [StartTimeValueBulk, setStartTimeValueBulk] = useState({ time: null });
  const [EndTimeValueBulk, setEndTimeValueBulk] = useState({ time: null });

  const handleStartimeChangeBulk = (value) => {
    const selectedHour = value.getHours();
  
    // Check if the selected start time is outside the valid range (8 AM to 10 PM)
    if (selectedHour < 8 || selectedHour > 21) {
      alert('Start time must be start from 8:00 AM.');
      return;
    }
  
    // If valid, update the start time value
    setStartTimeValueBulk({ time: value });
  
    // Reset the end time if it is earlier than or equal to the new start time
    if (EndTimeValueBulk?.time && value >= EndTimeValueBulk.time) {
      setEndTimeValueBulk(null); // Reset end time
    }
  };
  

 
  

  

  // const handleEndtimeChangeBulk = (value) => {
  //   const startHour = StartTimeValueBulk?.time ? StartTimeValueBulk.time.getHours() : 8; // Default to 8 AM
  //   const endHour = value.getHours();
  
  //   // Check if the selected end time is outside the valid range (8 AM to 10 PM)
  //   if (endHour < 8 || endHour > 21) {
  //     alert('End time must be between 10:00 PM.');
  //     return;
  //   }
  
  //   // Check if the end time is earlier than or equal to the start time
  //   if (StartTimeValueBulk?.time && value <= StartTimeValueBulk.time) {
  //     alert('End time must be later than the start time.');
  //     return;
  //   }
  
  //   // If valid, update the end time value
  //   setEndTimeValueBulk({ time: value });
  // };
  
  const handleDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // format as yyyy-MM-dd
    setFormValue(prevState => ({
      ...prevState,
      date: formattedDate
    }));
  };
 
  

  // ============Bulk Session date Change=====================
  const [selecteStartDateBulk, setSelectedStartDateBulk] = useState("");
  const [selecteEndDateBulk, setSelectedEndDateBulk] = useState("");


  const handleStartDateChangeBulk = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    setSelectedStartDateBulk(formattedDate); // Update the state
    console.log(selecteStartDateBulk); 
  };
  
  
 
  const handleEndDateChangeBulk = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("en-CA"); // Format the selected date
      setSelectedEndDateBulk(formattedDate); // Update the state
      console.log(formattedDate); // Debugging - Logs the formatted date
    }
  };
  
 
  
 // Use the formatted date
  
  
  const handleSubmit = () => {
    // Handle form submission
    alert(`Selected Time: ${formValue.time}`);
  };
  const [selectedValueRadio, setSelectedValueRadio] = useState('single');
  const handleChange = (event) => {
    setSelectedValueRadio(event.target.value);
  };


  const [dayofweek, setdayofweek] = useState([]);
  // console.log("Working Days",dayofweek);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleCloseDropdown = () => {
    setOpen(false);
  };

  const handelWorkingDayChange = (event) => {
    const { name, checked } = event.target;
    setdayofweek((prev) => 
      checked ? [...prev, name] : prev.filter(day => day !== name)
    );
  };

const slectedStudentID = selectedStudentDropdown?.id || null;
const SelectedStudentName = selectedStudentDropdown ? `${selectedStudentDropdown.first_name} ${selectedStudentDropdown.last_name}` : null;
// console.log("student_id",slectedStudentID);
// console.log("vvv",formValue.date);
const SingleSessionChooseDate = formValue.date ? 
  new Date(formValue.date).getFullYear() + '-' + 
  String(new Date(formValue.date).getMonth() + 1).padStart(2, '0') + '-' + 
  String(new Date(formValue.date).getDate()).padStart(2, '0') 
  : null;


  const SingleSessionStartTime = StartTimeValue.time
  ? moment(StartTimeValue.time).local().format("HH:mm:ss")
  : null;


  const SingleSessionEndTime = EndTimeValue.time
  ? moment(EndTimeValue.time).local().format("HH:mm:ss")
  : null;



console.log("Local System Time:", SingleSessionStartTime);


console.log("SingleSession Date",SingleSessionChooseDate);



  // =======================================
  const addSingleSession = async () => {
    const sessionDate = SingleSessionChooseDate; // Selected date for the session (e.g., "2025-01-09")
    // const sessionStartTime = SingleSessionStartTime; // e.g., "10:00:00"
    // const sessionEndTime = SingleSessionEndTime;

    const eventsOnSameDate = events.filter(event => {
        const eventStart = new Date(event.start);
        const eventDate = eventStart.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        return eventDate === sessionDate; // Check if the dates match
    });

    console.log("eventsOnSameDate", eventsOnSameDate);

    // Check if any events have the same time as the new session
    // for (let event of eventsOnSameDate) {
    //     const eventStartTime = new Date(event.start);
    //     const eventEndTime = new Date(event.end);
        
    //     if (eventStartTime.getTime() === new Date(`${sessionDate}T${sessionStartTime}`).getTime() &&
    //         eventEndTime.getTime() === new Date(`${sessionDate}T${sessionEndTime}`).getTime()) {
    //         toast.error("A session already exists at this time. Please choose a different time.", {
    //             position: "top-right",
    //             autoClose: 5000,
    //         });
    //         return;  // Exit the function as there is a conflict
    //     }
    // }
    // Check for conflicts in `all_event_bulk`

  //   const conflict = Bulkevents.some(event => {
  //     // Extract time part (HH:mm:ss) from the event start and end times
  //     const eventStartTime = new Date(event.start).toLocaleTimeString('en-GB', { hour12: false });
  //     const eventEndTime = new Date(event.end).toLocaleTimeString('en-GB', { hour12: false });
  
  
  //     console.log("eventStartTime:", eventStartTime);
  //     console.log("sessionStartTime:", sessionStartTime);
  //     console.log("eventEndTime:", eventEndTime);
  //     console.log("sessionEndTime:", sessionEndTime);
  
  //     // Compare the start and end times
  //     return eventStartTime === sessionStartTime && eventEndTime === sessionEndTime;
  // });
  
  // if (conflict) {
  //     toast.error("A session already exists at this time. Please choose a different time.", {
  //         position: "top-right",
  //         autoClose: 5000,
  //     });
  //     return;  // Stop execution if conflict is found
  // }
  
  const formatTimeToLocal = (date) => {
    if (!date) return null;
    const localDate = new Date(date);
    return localDate.toLocaleTimeString("en-GB", { hour12: false }); // "09:00:00"
  };
 
    const sessionData = {
        userRollID: userRollID, 
        id: slectedStudentID,
        selected_student: SelectedStudentName,
        sessionType: selectedValueRadio,
        date: sessionDate,
        // startTime: sessionStartTime,
        // endTime: sessionEndTime,
        timeSlots: divs.map(div => ({
          startTime: formatTimeToLocal(div.startTime),
          endTime: formatTimeToLocal(div.endTime),
        })),
    };

    console.log("Session Data:", sessionData);

    try {
        const response = await axios.post(`${backendUrl}/api/AddSingleSessions`, sessionData);
        if (response.status === 201) {
          // shouldFetchSingle();
            setShowModal(false);
            toast.success("Single Session Added!", {
                position: "top-right",
                autoClose: 5000,
            });
            setShouldFetchSingle(true);
        } else {
            throw new Error('Failed to create session');
        }
      } catch (error) {
        console.error("Error:", error);
    
        if (error.response?.status === 422) {
            const errors = error.response.data.errors;
    
            Object.entries(errors).forEach(([field, messages]) => {
                if (field !== "id") { // Ignore 'id' validation errors
                    messages.forEach((message) => {
                        toast.error(message, { position: "top-right", autoClose: 3000 });
                    });
                }
            });

          } else if (error.response?.status === 400) {
            // Handle "Exceeded Assigned Hours" error
            toast.error(error.response.data.message , {
                position: "top-right",
                autoClose: 5000
            });
        } else if (error.response?.status === 500) {
            toast.error("Internal server error. Please contact support.", { position: "top-right", autoClose: 5000 });
        } else {
            toast.error("Something went wrong. Please try again.", { position: "top-right", autoClose: 5000 });
        }
    }
};



// ====================Add Bulk Session=====================================

// const BulkSessionStartTime = StartTimeValueBulk.time ? StartTimeValueBulk.time.toISOString().split('T')[1].split('.')[0] : null;

const BulkSessionStartTime = StartTimeValueBulk.time
? moment(StartTimeValueBulk.time).local().format("HH:mm:ss")
: null;


const BulkSessionEndTime = EndTimeValueBulk.time
? moment(EndTimeValueBulk.time).local().format("HH:mm:ss")
: null;

const [shouldFetch, setShouldFetch] = useState(false);
const addBulkSession = async () => {

const wdays = dayofweek; // Array of selected days of the week

const daysOfWeekMap = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

const startDate = new Date(selecteStartDateBulk);  // Start date
const endDate = new Date(selecteEndDateBulk);    // End date
console.log("Bulk Start date",selecteStartDateBulk);

if (!selecteStartDateBulk || !selecteEndDateBulk) {
  toast.error("Start date and End date are required.", {
    position: "top-right",
    autoClose: 5000,
  });
  return; // Stop execution
}
// Function to generate dates for a specific day of the week
const generateDates = (startDate, endDate, dayOfWeek) => {
  let dates = [];
  let currentDate = new Date(startDate);

  // Loop through the dates until reaching the end date
  while (currentDate <= new Date(endDate)) {
    // If the current date is the desired day of the week (e.g., 'Friday')
    if (currentDate.getDay() === dayOfWeek) {
      dates.push(new Date(currentDate));  // Add the date to the list
    }
    currentDate.setDate(currentDate.getDate() + 1);  // Increment by 1 day
  }

  return dates;
};

// Prepare an array to store the session dates for all selected days of the week
let allSessionDates = [];

wdays.forEach(day => {
  const dayOfWeek = daysOfWeekMap[day]; // Get the day index from the map
  if (dayOfWeek !== undefined) {
    const generatedDates = generateDates(startDate, endDate, dayOfWeek);
    const formattedDates = generatedDates.map(date => date.getDate());
    allSessionDates = [...allSessionDates, ...formattedDates]; // Merge all session dates
  }
});

// Assuming selecteStartDateBulk is already in YYYY-MM-DD format
const eventDate = selecteStartDateBulk.trim();



// const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const existingEventDates = new Set();

// Helper function to generate all dates between the start and end dates
const getDateRange = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);  // Store as ISO date string
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// const eventsOnSameDateBulk = Bulkevents.filter(event => {
//   const eventStart = new Date(event.start);
//   const eventEnd = new Date(event.end);
  
//   // Get all dates in the event's range
//   const eventDates = getDateRange(eventStart, eventEnd);

//   const eventDayOfWeek = eventStart.getDay(); // Get day index (0-6)
//   const eventDayName = fullDayNames[eventDayOfWeek]; // Get the full event day name (e.g., 'Sunday')

//   // Filter out the event dates that already have an event
//   const isEventDateAvailable = eventDates.every(date => !existingEventDates.has(date));

//   // If all event dates are free, add the dates to the set
//   if (isEventDateAvailable && wdays.includes(eventDayName)) {
//     eventDates.forEach(date => {
//       existingEventDates.add(date);  // Add all event dates to the existing set
//     });
//     console.log(`Event added on ${eventDates.join(', ')} (${eventDayName})`);
//     return true; // Keep this event
//   } else {
//     console.log(`Skipping event on ${eventDates.join(', ')}: already has an event.`);
//     return false; // Skip this event
//   }
// });

// if (eventsOnSameDateBulk.length > 0) {
//   toast.error("Session already exists on the selected date(s). Please choose another date.", {
//     position: "top-right",
//     autoClose: 5000,
//   });
//   return; // Stop execution before making the API call
// }

// console.log("Events on the same date:", existingEventDates); // Set of existing event dates
// console.log("All session dates:", allSessionDates); // Array of session dates (day numbers)

const formattedSessionDates = allSessionDates.map(day => {
  const baseDate = new Date(selecteStartDateBulk); // Start date
  
  // Set the base date to the correct starting day
  baseDate.setDate(baseDate.getDate() + (day - baseDate.getDate())); // Add the day number to the base start date
  
  // Convert to 'YYYY-MM-DD' format and extract the day
  return baseDate.getDate(); // Only return the day of the month (e.g., 6, 13, 20, 27)
});

// // Filter the session dates to exclude those already in the existingEventDates set
const filteredSessionDates = formattedSessionDates.filter(day => {
  // Check if the day is already in the existingEventDates set
  return !Array.from(existingEventDates).some(existingDate => new Date(existingDate).getDate() === day);
});

// console.log("Filtered session dates:", filteredSessionDates);


const formatTimeToLocal = (date) => {
  if (!date) return null;
  const localDate = new Date(date);
  return localDate.toLocaleTimeString("en-GB", { hour12: false }); // "09:00:00"
};


const sessionData = {
  userRollID: userRollID, 
  id: slectedStudentID,
  selected_student: SelectedStudentName,
  sessionType: selectedValueRadio,
  dayofweek: wdays,  // This stores the array of selected days of the week
  startDate: selecteStartDateBulk,
  endDate: selecteEndDateBulk,

  // startTime: BulkSessionStartTime,
  // endTime: BulkSessionEndTime,
  sessions: bulkDivs.map((div) => ({
    startTime: formatTimeToLocal(div.startTime),
    endTime: formatTimeToLocal(div.endTime),
  })),
  sessionDates: filteredSessionDates, // Add the session dates here
};
  console.log("SessionData",sessionData);
  try {
      const response = await axios.post(`${backendUrl}/api/AddBulkSession`, sessionData);
      if (response.status === 201) {

        setShowModal(false);
        toast.success("Bulk Session Added!", {
          position: "top-right",
          autoClose: 5000,
      });
      setShouldFetch(true);
        
          // alert('Session created successfully!');
      } else {
          throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error("Error:", error);
  
      if (error.response?.status === 422) {
          const errors = error.response.data.errors;
  
          Object.entries(errors).forEach(([field, messages]) => {
              if (field !== "id" && field !== "sessionDates") { // Ignore 'id' validation errors
                  messages.forEach((message) => {
                      toast.error(message, { position: "top-right", autoClose: 3000 });
                  });
              }
          });
      } else if (error.response?.status === 500) {
          toast.error("Internal server error. Please contact support.", { position: "top-right", autoClose: 5000 });
      } else {
          toast.error("Something went wrong. Please try again.", { position: "top-right", autoClose: 5000 });
      }
  }
};

const studentOptionsinUpdateSingleSession = studentData.map(student => ({
  label: `${student.first_name} ${student.last_name}`, // Name displayed in the dropdown
  value: student, // The actual selected student object
}));

console.log("Selected Student:", selectedStudent);

console.log("studentOptionsinUpdateSingleSession",studentOptionsinUpdateSingleSession);

// ==========================================
console.log("studentDetails",studentData);
useEffect(() => {
  const FetchBulkSessionDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/BulkSessionDetails`);
      const data = response.data;
      console.log("Data from Bulk", data);

      const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const formattedEvents = data
        .filter(session => {
          return selectedStudent && selectedStudent.id
            ? session.student_id === selectedStudent.id
            : true; // Show all if no student is selected
        })
        .map((session) => {
          const wdays = session.dayofweek.split(",");
          console.log("Weekdays for session", wdays);

          const sessionStartDate = new Date(session.start_date);
          const sessionStartTime = moment(`${session.start_date} ${session.start_time}`, 'YYYY-MM-DD h:mm A').toDate();
          const sessionEndTime = moment(`${session.end_date} ${session.end_time}`, 'YYYY-MM-DD h:mm A').toDate();

          const formattedStartTime = moment(session.start_time, 'HH:mm:ss').format('h:mm A');
          const formattedEndTime = moment(session.end_time, 'HH:mm:ss').format('h:mm A');

          // Convert weekdays array to numeric day values
          const numericDays = wdays.map((day) => dayMap[day.trim()]);

          // Extract session dates from the session_dates string
          const sessionDates = session.session_dates.split(',').map(date => parseInt(date, 10));

          // Map the session dates with the time
          const recurringEvents = sessionDates.map((date) => {
            const eventDate = new Date(sessionStartDate);
            eventDate.setDate(date); // Set the day based on sessionDates

            const startDate = new Date(eventDate.setHours(sessionStartTime.getHours(), sessionStartTime.getMinutes()));
            const endDate = new Date(eventDate.setHours(sessionEndTime.getHours(), sessionEndTime.getMinutes()));

            return {
              title: `${session.student_name} - ${formattedStartTime} - ${formattedEndTime}`,
              start: startDate,
              end: endDate,
              student_id: session.student_id,
              session_name: session.session_name,
              bulk_session_id: session.id,

            };
          });

          return recurringEvents;
        }).flat(); // Flatten the array if there are multiple events for each session

      setBulkEvents(formattedEvents);
      console.log("Formatted Events Bulk:", formattedEvents);
    } catch (error) {
      console.error('Error fetching session details:', error);
      setError('Error fetching session details'); // Set error state
    }
  };
  FetchBulkSessionDetails();
  // Fetch data when selectedStudent or shouldFetch is updated
  if (selectedStudent || shouldFetch) {
   
    setShouldFetch(false);  // Reset shouldFetch after data is fetched
  }

}, [selectedStudent, shouldFetch]);  // Dependencies: selectedStudent and shouldFetch


   const studentOptions = studentData.map(student => ({
    label: `${student.first_name} ${student.last_name}`,
    value: student,
  }));


const validDate = formValue.date ? new Date(formValue.date) : null;
const selectedDate = validDate && !isNaN(validDate.getTime()) ? validDate : null;



// const handleSessionClick = (event) => {
//   const eventDate = new Date(event.start);
//   const today = new Date();

//   // Reset time for accurate date comparison
//   eventDate.setHours(0, 0, 0, 0);
//   today.setHours(0, 0, 0, 0);

//   // Reset all modal states first
//   setShowModalConfirmSession(false);
//   setShowModalSessionUpdateSingle(false);
//   setShowModalConfirmSessionBulk(false);

//   setTimeout(() => {
//     if (eventDate < today) {
//       console.log("Past event clicked:", event);
//       setShowModalConfirmSession(true);
//     } else if (eventDate > today) {
//       console.log("Future event clicked:", event);
//       selectedSession_type == "single"
//         ? setShowModalSessionUpdateSingle(true)
//         : setShowModalConfirmSessionBulk(true);
//     } else {
//       console.log("Today's event clicked:", event);
//       selectedSession_type == "single"
//         ? setShowModalSessionUpdateSingle(true)
//         : setShowModalConfirmSessionBulk(true);
//     }
//   }, 10); // Small delay ensures correct modal state update

//   setSelectedEvent(event);
// };





const handleCloseModalSession = () => {
  setShowModalConfirmSession(false); // Hide the modal
  setShowModalSessionUpdateSingle(false); // Hide the modal);
  setShowModalConfirmSessionBulk(false);
};

// ====================Confirm Session================================
  const [selectedDateConfirmSession, setConfirmSessionSelectedDate] = useState(null);
  const [selectedSession_type, setSession_type] = useState(null);
  const [selectedSession_studentID, setSession_StudentID] = useState(null);
  const [startTimeConfirmSession, setStartTimeConfirmSession] = useState(null);
  const [SingleSessionDate, setSingleSessiondate] = useState(null);
  const [endTimeConfirmSession, setEndTimeConfirmSession] = useState(null);
  const [bulk_session_id, set_bulk_session_id] = useState(null);
  
  const [selectedValueRadioConfirmSession, setSelectedValueRadioConfirmSession] = useState("yes");
  const [selectedEvent, setSelectedEvent] = useState({
  start: '',
  end: ''
});
console.log("selected_session_type",selectedEvent);

  useEffect(() => {
    if (selectedEvent && selectedEvent.start && selectedEvent.end && selectedEvent.session_name && selectedEvent.student_id) {
      const eventStartDate = new Date(selectedEvent.start);
      const eventEndDate = new Date(selectedEvent.end);
      const session_name = selectedEvent.session_name;
      const selected_session_studentID = selectedEvent.student_id;
      const single_session_date = selectedEvent.session_date;
      const bulk_session_id = selectedEvent.bulk_session_id;
      const single_seesion_autoID = selectedEvent.id;
      // Format the start time to 'hh:mm AM/PM'
      const eventStartTime = eventStartDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  
      // Format the end time to 'hh:mm AM/PM'
      const eventEndTime = eventEndDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  
      // Extract date in 'YYYY-MM-DD' format
      const eventDate = eventStartDate.toISOString().split("T")[0];
  
      // Set the date, start time, and end time in state
      setSession_type(session_name);
      setSession_StudentID(selected_session_studentID);
      setSingleSessiondate(single_session_date);
      setConfirmSessionSelectedDate(eventDate);
      setStartTimeConfirmSession(eventStartTime);
      setEndTimeConfirmSession(eventEndTime);
      set_bulk_session_id(bulk_session_id);
      setSingleSessionAutoID(single_seesion_autoID);
  
      // Log times for debugging
      console.log("Event Date:", eventDate);
      console.log("Start Time:", eventStartTime);
      console.log("End Time:", bulk_session_id);
    } else {
      // Fallback case if selectedEvent is not valid
      // console.error("Invalid event data 1", selectedEvent);
    }
  }, [selectedEvent]);
  
  
 

      // Handle changes in radio buttons
  const handleChangeConfirmSession = (e) => {
    setSelectedValueRadioConfirmSession(e.target.value);
    console.log(e.target.value); 
    
  }

  console.log("AAAA",selectedSession_type);
  console.log("AAAA",selectedSession_studentID);
  console.log("AAAA",selectedDateConfirmSession);
  console.log("AAAA",bulk_session_id);
//  ===============================================
  
const onclickConfirmSession = () => {
  const requestData = {
    userRollID: userRollID,
    session_type: selectedSession_type,
    student_id: selectedSession_studentID,
    selectedDateConfirmSession: selectedDateConfirmSession,
    startTimeConfirmSession: startTimeConfirmSession,
    endTimeConfirmSession: endTimeConfirmSession,
  };

  console.log("Data being sent to the server:", requestData); // Log the data

  axios
    .post(`${backendUrl}/api/ConfirmSession`, requestData, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
      // Handle success
      setShowModalConfirmSession(false); // Close the modal
      toast.success("Session successfully confirmed!", {
        position: "top-right",
        autoClose: 5000,
      });
      console.log("Session confirmed:", response.data);
    })
    .catch((error) => {
      // Handle errors
      if (error.response && error.response.data) {
        // Display the exact message from the server
        toast.error(error.response.data.message || "Session alreday Exists.", {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Error response from server:", error.response.data);
      } else {
        // General error fallback
        toast.error("Failed to confirm the session. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Unexpected error:", error);
      }
    });
};



  
  // ===================================================

  const onclickDeleteSession = (selectedSession_type, selectedSession_studentID, SingleSessionDate , selectedDateConfirmSession , bulk_session_id) => {
    axios
      .delete(`${backendUrl}/api/DeleteSession`, {
        headers: { 'Content-Type': 'application/json' }, // Explicit headers
        data: {
          session_type: selectedSession_type,
          student_id: selectedSession_studentID,
          single_session_date: SingleSessionDate,
          selectedDateConfirmSession : selectedDateConfirmSession,
          bulk_session_id :bulk_session_id,
        },
      })
      
      .then(() => {
        // FetchSingleSessionDetails();
        // FetchBulkSessionDetails(); 
         


         setShowModalConfirmSession(false); 
        toast.success("Session successfully deleted!", {
          position: "top-right",
          autoClose: 5000,
        });
        // Trigger re-fetch for the next deletion or update
      setShouldFetch(true);
      setShouldFetchSingle(true);
      })
      .catch((error) => {
        console.error('Error deleting session:', error);
        toast.error("Failed to delete the session. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };
  
  const [showMoreEvents, setShowMoreEvents] = useState(false);

// Handler to toggle the visibility of additional events
const handleShowMoreClick = () => {
  setShowMoreEvents(!showMoreEvents);
  alert("erty")
};
  

const handleNavigateWeek = (action) => {
  let newDate = new Date(currentDate);

  if (action === 'PREV') {
    newDate.setDate(newDate.getDate() - 7); // Go to the previous week
  } else if (action === 'NEXT') {
    newDate.setDate(newDate.getDate() + 7); // Go to the next week
  } else if (action === 'TODAY') {
    newDate = new Date(); // Reset to today's date
  }

  setCurrentDate(newDate); // Update the current date to trigger a re-render
};
// ================Start and end time clone in single session==================

const [divs, setDivs] = useState([{ startTime: null, endTime: null }]); // Now starts with one div
// Stores all cloned divs
  

  // Function to add a new time picker div
  const addNewDiv = () => {
    setDivs([...divs, { startTime: null, endTime: null }]);
  };

  // Handle start time change
  const handleStartTimeChange = (value, index) => {
    const newDivs = [...divs];
    newDivs[index].startTime = value;
    setDivs(newDivs);
  };

  // Handle end time change
  const handleEndTimeChange = (value, index) => {
    const newDivs = [...divs];
    newDivs[index].endTime = value;
    setDivs(newDivs);
  };

 
  const removeDiv = (index) => {
    if (divs.length > 1) {
      setDivs(divs.filter((_, i) => i !== index));
    }
  };
  
// ===END========Start and end time clone in single session===================



// =========Clone of Add another button of start and end time in bulk=====
const [bulkDivs, setBulkDivs] = useState([
  { startTime: null, endTime: null },
]);

const addNewBulkDiv = () => {
  setBulkDivs([...bulkDivs, { startTime: null, endTime: null }]);
};

const removeBulkDiv = (index) => {
  setBulkDivs(bulkDivs.filter((_, i) => i !== index));
};

const handleStartTimeChangeBulk = (value, index) => {
  const newBulkDivs = [...bulkDivs];
  newBulkDivs[index].startTime = value;
  setBulkDivs(newBulkDivs);
};

const handleEndTimeChangeBulk = (value, index) => {
  const newBulkDivs = [...bulkDivs];
  newBulkDivs[index].endTime = value;
  setBulkDivs(newBulkDivs);
};
// ====================When click on Session in calender , then show as per session type=================
const handleSessionClick = (event) => {
  setSelectedEvent(null); // Force re-run of useEffect by clearing first
  setTimeout(() => setSelectedEvent(event), 0); // Delay ensures state update
};

useEffect(() => {
  if (!selectedEvent) return;

  const eventDate = new Date(selectedEvent.start);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  console.log("Latest selectedSession_type:", selectedSession_type);

  // Reset modal states before opening the correct one
  setShowModalConfirmSession(false);
  setShowModalSessionUpdateSingle(false);
  setShowModalConfirmSessionBulk(false);

  setTimeout(() => {
    if (eventDate < today) {
      setShowModalConfirmSession(true);
    } else if (selectedSession_type === "single") {
      setShowModalSessionUpdateSingle(true);
    } else if (selectedSession_type === "bulk") {
      setShowModalConfirmSessionBulk(true);
    }
  }, 0); // Small delay ensures re-render
}, [selectedEvent, selectedSession_type]);

// ====================================================
// ==============Single session modal update===============================
const handleChangeSingleSessionUpdatestartTime = (time) => {
  if (time instanceof Date && !isNaN(time)) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const modifier = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const formattedTime = `${formattedHours}:${formattedMinutes} ${modifier}`;
    console.log("Selected Time:", formattedTime);
    setStartTimeConfirmSession(formattedTime);
  }
};

const handleChangeSingleSessionUpdateEndTime = (time) => {
  if (time instanceof Date && !isNaN(time)) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const modifier = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const formattedTime = `${formattedHours}:${formattedMinutes} ${modifier}`;
    console.log("Selected Time:", formattedTime);
    setEndTimeConfirmSession(formattedTime);
  }
};
  const getDateFromString = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return new Date(); // Default to current date if invalid

    const date = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    date.setHours(hours, minutes, 0);
    return date;
  };

  const handleDateChangeInSingleSessionUpdate = (newDate) => {
    if (newDate) {
      const formattedDate = new Date(newDate).toISOString().split("T")[0]; // Ensure YYYY-MM-DD format
      setConfirmSessionSelectedDate(formattedDate);
    } else {
      setConfirmSessionSelectedDate(null);
    }
  };

  const [singlesessionAutoID, setSingleSessionAutoID] = useState(false);
console.log("singlesessionAutoID",singlesessionAutoID);
  const onclickUpdateSingleSession = () => {
    const requestData = {
      singlesessionAutoID: singlesessionAutoID,
      userRollID: userRollID,
      student_id: selectedSession_studentID,
      selectedDateConfirmSession: selectedDateConfirmSession,
      startTimeConfirmSession: startTimeConfirmSession,
      endTimeConfirmSession: endTimeConfirmSession,
    };
  
    console.log("Data being sent to the server:", requestData); // Log the data
  
    axios
      .post(`${backendUrl}/api/UpdateSingleSession`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        // Handle success
        setShowModalSessionUpdateSingle(false); // Close the modal
        toast.success("Session successfully updated.", {
          position: "top-right",
          autoClose: 5000,
        });
        console.log("Session confirmed:", response.data);
        setShouldFetch(true);
        setShouldFetchSingle(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
    
            // ✅ Handle Validation Errors
            if (errorData.errors) {
                Object.keys(errorData.errors).forEach((key) => {
                    toast.error(errorData.errors[key][0], {
                        position: "top-right",
                        autoClose: 5000,
                    });
                });
            } 
            // ✅ Handle General Error Messages
            else if (errorData.message) {
                toast.error(errorData.message, {
                    position: "top-right",
                    autoClose: 5000,
                });
            } 
            // ✅ Handle Unexpected Errors
            else {
                toast.error("An unknown error occurred.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
    
            console.error("Error response from server:", errorData);
        } else {
            // Fallback for network errors
            toast.error("Failed to confirm the session. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
            console.error("Unexpected error:", error);
        }
    });
  };
  useEffect(() => {
    setLoading(true); // Immediately show loading indicator
  
    if (userRollID && userRollName) {
      setLoading(false); // Hide loader when data is available
    }
  }, [userRollID, userRollName]);
  
    // ============End of Single session modal update===========
    return (
      <div style={{ color: '#4979a0', backgroundColor: 'white' }}>
        {loading ? (
          <div className="loader-container">
          <div className="loader-content">
            <img src={logo} alt="Loading..." className="logo-loader" />
            <PropagateLoader  color="#3498db" size={10} />
          </div>
        </div>
        ) : (
          <>
            <ToastContainer />
            <h2>Calendar</h2>
    
            <Calendar
              localizer={localizer}
              events={[...events, ...Bulkevents]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onShowMore={(events, date) => {
                const SingleSessionDate = moment(date).format('YYYY-MM-DD');
                console.log('Redirecting to:', SingleSessionDate);
    
                setView('day'); // Change to the day view
                setCurrentDate(new Date(SingleSessionDate)); // Update calendar to selected date
              }}
              view={view} // Controlled view based on state
              date={currentDate} // Set the current date for navigation
              onView={handleViewChange} // View change handler
              onNavigate={handleNavigate}
              onSelectEvent={handleSessionClick}
              eventPropGetter={(event) => ({
                style: event.style || {},
              })}
              components={{
                toolbar: ({ label }) => (
                  <div
                    className="rbc-toolbar"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div className="rbc-btn-group">
                      <button onClick={() => setView('month')}>Month</button>
                      <button onClick={() => setView('week')}>Week</button>
                      <button onClick={() => setView('day')}>Day</button>
                      <button onClick={() => setView('agenda')}>Agenda</button>
                    </div>
    
                    <div
                      className="rbc-toolbar-label"
                      style={{
                        fontSize: '25px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 1,
                        marginLeft: '23px',
                      }}
                    >
                      {label}
                    </div>
                    <i
                      className="fa fa-backward fc-back-icon_calendar"
                      aria-hidden="true"
                      id="back_provider_click"
                      onClick={backtodashboard}
                    ></i>
    
                    {view !== 'week' && (
                      <div className="rbc-btn-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => handleNavigate('PREV')}>Prev</button>
                        <button onClick={() => handleNavigate('TODAY')}>Today</button>
                        <button onClick={() => handleNavigate('NEXT')}>Next</button>
                      </div>
                    )}
    
                    {view === 'week' && (
                      <div className="rbc-btn-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => handleNavigateWeek('PREV')}>Prev Week</button>
                        <button onClick={() => handleNavigateWeek('NEXT')}>Next Week</button>
                      </div>
                    )}
    
                    <div className="card flex justify-content-center" style={{ width: '225px', margin: '-2px 10px' }}>
                      <PrimeReactDropdown
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.value)}
                        options={studentOptions}
                        optionLabel="label" // `label` corresponds to the full name of the student
                        placeholder="Select a Student"
                        highlightOnSelect={false}
                      />
                    </div>
                  </div>
                ),
    
                // ==============Start of Add Session===========
                dateCellWrapper:
                  userRollName === 'Provider'
                    ? ({ children, value }) => {
                        const isCurrentMonth = value.getMonth() === currentDate.getMonth();
                        return (
                          <div
                            className="rbc-day-bg"
                            role="cell"
                            style={{
                              backgroundColor: isCurrentMonth ? 'white' : '#f0f0f0', // Grey color for non-current month dates
                              color: isCurrentMonth ? 'inherit' : '#a0a0a0', // Greyed-out text color for non-current month dates
                            }}
                          >
                            {children}
                            <button
                              type="button"
                              className="rbc-button-link"
                              style={{
                                position: 'relative',
                                marginLeft: '4px',
                                top: '0px',
                                zIndex: 10,
                              }}
                              onClick={() => handlePlusClick(value)}
                            >
                              <FontAwesomeIcon icon={faPlusCircle} />
                            </button>
                          </div>
                        );
                      }
                    : undefined,
              }}
            />
          </>
        )}
      
    



  
      {/* Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <Modal.Dialog>
            <Modal.Header closeButton onClick={handleCloseModal}>
              <Modal.Title>Add Session</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <p className ="fontsizeofaddsessionmodal">
                  Choose What You Want
                </p>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <Radio
                    checked={selectedValueRadio === "single"}
                    onChange={handleChange}
                    value="single"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Single" }}
                    className="text-blue-600"
                  />
                  <span>Single Session</span>
                </label>

                <label className="flex items-center space-x-2">
                  <Radio
                    checked={selectedValueRadio === "bulk"}
                    onChange={handleChange}
                    value="bulk"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "bulk" }}
                    className="text-blue-600"
                  />
                  <span>Bulk Session</span>
                </label>
              </div>
          
              <div>
                <p className ="fontsizeofaddsessionmodal">Student</p>
                <Dropdown title={selectedStudentDropdown ? `${selectedStudentDropdown.first_name} ${selectedStudentDropdown.last_name}` : 'Select Student'}>
                  {studentData.map((student, index) => (
                    <Dropdown.Item key={index} onClick={() => handleStudentSelect(student)}>
                      {`${student.first_name} ${student.last_name}`}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>

              {selectedValueRadio === "bulk" && (
                <>
                  
                  <div>
                  <p className ="fontsizeofaddsessionmodal">Day of the Week:</p>
                    <Button 
                      className="" 
                      onClick={handleDropdownClick} 
                      variant="outlined" 
                      style={{ '--bs-btn-padding-x': '19px', marginLeft:'2px', borderColor: 'rgb(197, 198, 199)' }}
                    >
                      {dayofweek.length > 0 ? dayofweek.join(', ') : 'Choose All That Apply'}
                    </Button>
                    <Popover
                      id="working-days-popover"
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleCloseDropdown}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      sx={{ border: '1px solid #ccc' }}
                    >
                      <List>
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((workingday) => (
                          <ListItem key={workingday}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={dayofweek.includes(workingday)}
                                  onChange={handelWorkingDayChange}
                                  name={workingday}
                                />
                              }
                              label={workingday}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Popover>
                  </div>
                </>
              )}
               {/* ===================For Single ====================== */}
              {selectedValueRadio === "single" && (
              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Choose Date</Form.ControlLabel>
                <DatePicker
                  value={formValue.date ? new Date(selectedDate) : null}
                  onChange={handleDateChange}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
                )}
              {/* ===================For Bulk ====================== */}
              {selectedValueRadio === "bulk" && (
              <div className="stu-pro-field-div">
              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Date</Form.ControlLabel>
                <DatePicker
                 
                  onChange={handleStartDateChangeBulk}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Date</Form.ControlLabel>
                <DatePicker
                  
                  onChange={handleEndDateChangeBulk}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              </div>
              )}

              {/* ===================For Single ====================== */}
              {selectedValueRadio === "single" && (
               <>
                 {/* Render cloned divs with independent time values */}
                 {divs.map((div, index) => (
                  <div key={index} className="stu-pro-field-div" style={{ marginTop: "10px" }}>
                    <Form.Group controlId={`start-time-${index}`}>
                      <Form.ControlLabel className="fontsizeofaddsessionmodal">
                        Start Time 
                      </Form.ControlLabel>
                      <TimePicker
                        value={div.startTime}
                        onChange={(value) => handleStartTimeChange(value, index)}
                        format="hh:mm a"
                        showMeridian
                      />
                    </Form.Group>

                    <Form.Group controlId={`end-time-${index}`}>
                      <Form.ControlLabel className="fontsizeofaddsessionmodal">
                        End Time 
                      </Form.ControlLabel>
                      <TimePicker
                        value={div.endTime}
                        onChange={(value) => handleEndTimeChange(value, index)}
                        format="hh:mm a"
                        showMeridian
                      />
                    </Form.Group>
                    {index > 0 && (
                    <button
                        type="button"
                        className="remove-button"
                        style={{
                          backgroundColor: "white",
                        
                          border: "none",
                          borderRadius: "5px",
                          padding: "-1px 5px",
                          cursor: "pointer",
                          marginTop: "41px",
                          height: "21px",
                        }}
                        onClick={() => removeDiv(index)}
                     >
                      <FontAwesomeIcon icon={faMinusCircle } /> 
                    </button>
                 )}
                  </div>
                 ))}
                  {/* Add Another Button */}
                  <button
                      type="button"
                      className="add-button"
                      style={{
                        backgroundColor: "white",
                        marginLeft: "-11px",
                        width: "8rem",
                        marginTop: "0px",
                        fontSize: "14px",
                      }}
                      onClick={addNewDiv}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add Another
                    </button>
                </>
                )}
               {/* ===================For Bulk ====================== */}
          {selectedValueRadio === "bulk" && (
            <>
            {bulkDivs.map((div, index) => (
              <div
                key={index}
                className="stu-pro-field-div"
                style={{ marginTop: "10px", display: "flex", alignItems: "center" }}
              >
                <Form.Group controlId={`bulk-start-time-${index}`} style={{ marginRight: "10px" }}>
                  <Form.ControlLabel className="fontsizeofaddsessionmodal">Start Time</Form.ControlLabel>
                  <TimePicker
                    value={div.startTime}
                    onChange={(value) => handleStartTimeChangeBulk(value, index)}
                    format="hh:mm a"
                    showMeridian
                  />
                </Form.Group>

                <Form.Group controlId={`bulk-end-time-${index}`} style={{ marginRight: "10px" }}>
                  <Form.ControlLabel className="fontsizeofaddsessionmodal">End Time</Form.ControlLabel>
                  <TimePicker
                    value={div.endTime}
                    onChange={(value) => handleEndTimeChangeBulk(value, index)}
                    format="hh:mm a"
                    showMeridian
                  />
                </Form.Group>

                {/* Show Remove button only for second div onwards */}
                {index > 0 && (
                  <button type="button" onClick={() => removeBulkDiv(index)} className="remove-button">
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </button>
                )}
              </div>
            ))}

            {/* Add Another Button */}
            <button
              type="button"
              className="add-button"
              style={{
                backgroundColor: "white",
                marginLeft: "-11px",
                width: "8rem",
                marginTop: "10px",
                fontSize: "14px",
              }}
              onClick={addNewBulkDiv}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Another
            </button>
            </>
          )}


               
            </Modal.Body>
           
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              {selectedValueRadio === "bulk" && (
              <Button variant="primary" onClick={addBulkSession}>Save changes B</Button>
              )}
              {selectedValueRadio === "single" && (
                  <Button variant="primary" onClick={addSingleSession}>Save changes S</Button>
              )}
               
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
      {/* ==================================== */}
      {showModalofSession && (
        <div className="modal show" style={{ display: 'block' }}>
          <Modal.Dialog>
            <Modal.Header closeButton onClick={handleCloseModalSession}>
              <Modal.Title>Confirm Session</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="stu-pro-field-div">
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Confirm Session</Form.ControlLabel>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <Radio
                        checked={selectedValueRadioConfirmSession === "yes"}
                        onChange={handleChangeConfirmSession}
                        value="yes"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "yes" }}
                        className="text-blue-600"
                      />
                      <span>Yes</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <Radio
                        checked={selectedValueRadioConfirmSession === "no"}
                        onChange={handleChangeConfirmSession}
                        value="no"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "no" }}
                        className="text-blue-600"
                      />
                      <span>No</span>
                    </label>
                    <p style={{ marginTop: '=4px' , fontSize:"11px" }}>*If you select No, the session will be rejected.</p>

                  </div>
              </Form.Group>
              
              </div>
              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Date</Form.ControlLabel>
                <DatePicker
                  format="yyyy-MM-dd"
                  value={selectedEvent.start ? new Date(selectedEvent.start) : null} disabled

                />
              </Form.Group>

              <div className="stu-pro-field-div">
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time</Form.ControlLabel>
                 <Input className="rs_input_custom"  placeholder="Default Input"
                  value={startTimeConfirmSession  || "" } disabled
                />
              </Form.Group>
              <br/>
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time</Form.ControlLabel>
                
                <Input className="rs_input_custom" placeholder="Default Input"
                  value={endTimeConfirmSession  || ""} disabled 
                />
              </Form.Group>
            </div>
          </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalSession}>Close</Button>

              {selectedValueRadioConfirmSession === "no" ? (
              <Button variant="primary" onClick={() => onclickDeleteSession(selectedSession_type,selectedSession_studentID ,SingleSessionDate,selectedDateConfirmSession,bulk_session_id)}>Confirm Session</Button>
            ) : (
              <Button variant="primary" onClick={() => onclickConfirmSession(selectedSession_type,selectedSession_studentID ,startTimeConfirmSession,selectedDateConfirmSession,endTimeConfirmSession)}>Confirm Session</Button>
            )}
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}

      {/* ================================== */}
      {showModalofSessionSingle && (
        <div className="modal show" style={{ display: 'block' }}>
            <Modal.Dialog>
              <Modal.Header closeButton onClick={handleCloseModalSession}>
                <Modal.Title>Update Session</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <SelectPicker
              className="updateSinglesessionmodalclass"
              data={studentOptions}
              value={selectedStudent}
              onChange={setSelectedStudent}
              placeholder="Select a Student"
              searchable={false}  // 🔥 This should remove the search box
              style={{ width: 224 }}
              />

              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Date</Form.ControlLabel>
                <DatePicker
                  format="yyyy-MM-dd"
                  value={selectedDateConfirmSession ? new Date(selectedDateConfirmSession) : null}
                  onChange={handleDateChangeInSingleSessionUpdate}

                />
              </Form.Group>

              <div className="stu-pro-field-div">
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time</Form.ControlLabel>
                 
              <TimePicker    value={getDateFromString(startTimeConfirmSession)}onChange={handleChangeSingleSessionUpdatestartTime}
                format="hh:mm a"
                showMeridian
              />
              </Form.Group>
              <br/>
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time</Form.ControlLabel>
                <TimePicker    value={getDateFromString(endTimeConfirmSession)}onChange={handleChangeSingleSessionUpdateEndTime}
                format="hh:mm a"
                showMeridian
              />
              </Form.Group>
            </div>
          </Modal.Body>

            <Modal.Footer>
                <Button className=" .delete_button_update_single_session" variant="danger" >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </Button>

              <Button variant="primary" onClick={() => onclickUpdateSingleSession(selectedSession_studentID ,startTimeConfirmSession,selectedDateConfirmSession,endTimeConfirmSession)}>Update</Button>
            
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    {/* ==================== */}
    {/* ================================== */}
    {showModalofSessionBulk && (
        <div className="modal show" style={{ display: 'block' }}>
          <Modal.Dialog>
            <Modal.Header closeButton onClick={handleCloseModalSession}>
              <Modal.Title>Update Session Bulk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="stu-pro-field-div">
                <Form.Group controlId="date">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Date S</Form.ControlLabel>
                  <DatePicker
                    format="yyyy-MM-dd"
                    value={selectedEvent.start ? new Date(selectedEvent.start) : null}
                  />

                  
                </Form.Group>
                <Form.Group controlId="date">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Date S</Form.ControlLabel>
                  <DatePicker
                    format="yyyy-MM-dd"
                    value={selectedEvent.start ? new Date(selectedEvent.start) : null}

                  />
                </Form.Group>
              </div>
              <div className="stu-pro-field-div">
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time C</Form.ControlLabel>
                 <Input className="rs_input_custom"  placeholder="Default Input"
                  value={startTimeConfirmSession  || "" }
                />

              
              </Form.Group>
              <br/>
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time C</Form.ControlLabel>
                
                <Input className="rs_input_custom" placeholder="Default Input"
                  value={endTimeConfirmSession  || ""}
                />
              </Form.Group>
            </div>
          </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalSession}>Close</Button>

              {selectedValueRadioConfirmSession === "no" ? (
              <Button variant="primary" onClick={() => onclickDeleteSession(selectedSession_type,selectedSession_studentID ,SingleSessionDate,selectedDateConfirmSession,bulk_session_id)}>Confirm Session</Button>
            ) : (
              <Button variant="primary" onClick={() => onclickConfirmSession(selectedSession_type,selectedSession_studentID ,startTimeConfirmSession,selectedDateConfirmSession,endTimeConfirmSession)}>Confirm Session</Button>
            )}
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    
    </div>
  );
};

export default CalendarComponent;

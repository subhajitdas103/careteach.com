import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
import moment from 'moment-timezone';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

// import { Dropdown } from 'primereact/dropdown';

// Configure the calendar to use moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userRollName, setRollName] = useState(null);
// ============Getting Roll Name from Session=========

useEffect(() => {
    // Retrieve the stored roll name
    const rollName = localStorage.getItem("authRollName");
    console.log("Retrieved Roll Name:", rollName);
    setRollName(rollName);
  }, []);
  // ==========End of getting RollName================
  
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // console.log("Selected student",selectedStudent);
  const [events, setEvents] = useState([
    {
      title: 'Meeting with Team',
      start: new Date(2024, 11, 3, 10, 0), // Dec 3, 2024, 10:00 AM
      end: new Date(2024, 11, 3, 11, 0),   // Dec 3, 2024, 11:00 AM
    },
    {
      title: 'Lunch Break',
      start: new Date(2024, 11, 3, 13, 0), // Dec 3, 2024, 1:00 PM
      end: new Date(2024, 11, 3, 14, 0),   // Dec 3, 2024, 2:00 PM
    },
  ]);

  useEffect(() => {
    console.log('Event Start Times:', events.map(event => event.start.toLocaleString()));
    console.log('Event End Times:', events.map(event => event.end.toLocaleString()));
  }, [events]);

  const [Bulkevents, setBulkEvents] = useState([
    {
      title: 'Meeting with Team',
      start: new Date(2024, 11, 3, 10, 0), // Dec 3, 2024, 10:00 AM
      end: new Date(2024, 11, 3, 11, 0),   // Dec 3, 2024, 11:00 AM
    },
    {
      title: 'Lunch Break',
      start: new Date(2024, 11, 3, 13, 0), // Dec 3, 2024, 1:00 PM
      end: new Date(2024, 11, 3, 14, 0),   // Dec 3, 2024, 2:00 PM
    },
  ]);

  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showModalofSession, setShowModalSession] = useState(false); 
  const handleViewChange = (viewType) => {
    setView(viewType);
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

  useEffect(() => {
    const FetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/Students`);
        const data = response.data;  // No need for .json() with axios
        console.log(data);
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    FetchStudentDetails();
  }, []);
  
// ==========================================

useEffect(() => {
  const FetchSingleSessionDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/SingleSession`);
      const data = response.data; // Axios automatically parses JSON
      
      // Transform the data to match the events structure
      const formattedEvents = data.map((session) => {
        // Format start and end time with 'Z' for UTC handling
        const sessionStartTime = moment(`${session.date} ${session.start_time}`, 'YYYY-MM-DD h:mm A').toDate();

        const sessionEndTime = moment(`${session.date} ${session.end_time}`, 'YYYY-MM-DD h:mm A').toDate();
       
        const formattedStartTime = moment(session.start_time, 'HH:mm:ss').format('h:mm A');
          const formattedEndTime = moment(session.end_time, 'HH:mm:ss').format('h:mm A');

         


        return {
          title: `${session.student_name} - ${formattedStartTime} - ${formattedEndTime}`,
          start: sessionStartTime, // Combined Date and start_time
          end: sessionEndTime, 
          student_id :session.student_id,
          session_name: session.session_name, 
          session_date :session.date, 
          // Combined Date and end_time
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
}, []);


// =====================================

  const handleStudentSelect = (student) => {
    // const name = `${student.first_name} ${student.last_name}`;
    setSelectedStudent(student); // Update state with the full name
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
  

 
  

  

  const handleEndtimeChangeBulk = (value) => {
    const startHour = StartTimeValueBulk?.time ? StartTimeValueBulk.time.getHours() : 8; // Default to 8 AM
    const endHour = value.getHours();
  
    // Check if the selected end time is outside the valid range (8 AM to 10 PM)
    if (endHour < 8 || endHour > 21) {
      alert('End time must be between 10:00 PM.');
      return;
    }
  
    // Check if the end time is earlier than or equal to the start time
    if (StartTimeValueBulk?.time && value <= StartTimeValueBulk.time) {
      alert('End time must be later than the start time.');
      return;
    }
  
    // If valid, update the end time value
    setEndTimeValueBulk({ time: value });
  };
  
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

const slectedStudentID = selectedStudent?.id || null;
const SelectedStudentName = selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : null;
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


console.log("all_event",events);
console.log("all_event_bulk",Bulkevents);
  // =======================================
  const addSingleSession = async () => {

    const sessionDate = SingleSessionChooseDate; // Selected date for the session (e.g., "2025-01-09")
    const sessionStartTime = SingleSessionStartTime; // e.g., "10:00:00"
    const sessionEndTime = SingleSessionEndTime;
    console.log("sessionStartTime",sessionStartTime);
    console.log("sessionEndTime",sessionEndTime);



    const eventsOnSameDate = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventDate = eventStart.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
      return eventDate === sessionDate; // Check if the dates match
    });

console.log("eventsOnSameDate",eventsOnSameDate);
const sessionTimes = eventsOnSameDate.map(event => ({
  startTime: event.start, // The start time of the event
  endTime: event.end,     // The end time of the event
}));

console.log("Session Times:", sessionTimes);

eventsOnSameDate.forEach(event => {
  // Extract the time in HH:MM:SS format
  const eventStartTime = event.start.toTimeString().split(' ')[0];
  const eventEndTime = event.end.toTimeString().split(' ')[0];

  if (eventStartTime === sessionStartTime && eventEndTime === sessionEndTime) {
    toast.error("A session already exists on this time. Please choose a different time.", {
      position: "top-right",
      autoClose: 5000,
  });
  return;
  } 
});
    
 


    const sessionData = {
        id: slectedStudentID,
        selected_student : SelectedStudentName,
        sessionType: selectedValueRadio,
        date: SingleSessionChooseDate,
        startTime: SingleSessionStartTime,
        endTime: SingleSessionEndTime ,
    };
    console.log("xxxxxxxxxxxxxxx",sessionData);
    try {
        const response = await axios.post(`${backendUrl}/api/AddSingleSessions`, sessionData);
        if (response.status === 201) {

          setShowModal(false);
          toast.success("Single Session Added!", {
            position: "top-right",
            autoClose: 5000,
        });

          
            // alert('Session created successfully!');
        } else {
            throw new Error('Failed to create session');
        }
    } catch (error) {
        console.error('Error:', error);
        // alert('There was an error creating the session.');
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

// const BulkSessionEndTime = EndTimeValueBulk.time ? EndTimeValueBulk.time.toISOString().split('T')[1].split('.')[0] : null;
const add_BulkSession = async () => {

  const wdays = dayofweek;
console.log("xx", wdays);

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



const sessionData = {
  id: slectedStudentID,
  selected_student: SelectedStudentName,
  sessionType: selectedValueRadio,
  dayofweek: wdays,  // This stores the array of selected days of the week
  startDate: selecteStartDateBulk,
  endDate: selecteEndDateBulk,
  startTime: BulkSessionStartTime,
  endTime: BulkSessionEndTime,
  sessionDates: allSessionDates, // Add the session dates here
};
  console.log(sessionData);
  try {
      const response = await axios.post(`${backendUrl}/api/AddBulkSession`, sessionData);
      if (response.status === 201) {

        setShowModal(false);
        toast.success("Bulk Session Added!", {
          position: "top-right",
          autoClose: 5000,
      });

        
          // alert('Session created successfully!');
      } else {
          throw new Error('Failed to create session');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('There was an error creating the session.');
  }
};


// ==========================================

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

          // const sessionStartTime = new Date(`${session.start_date}T${session.start_time}Z`);

          const sessionStartTime = moment(`${session.start_date} ${session.start_time}`, 'YYYY-MM-DD h:mm A').toDate();



          // const sessionEndTime = new Date(`${session.end_date}T${session.end_time}Z`);

          const sessionEndTime = moment(`${session.end_date} ${session.end_time}`, 'YYYY-MM-DD h:mm A').toDate();
          

          // const formattedStartTime = sessionStartTime.toLocaleTimeString('en-US', { 
          //   hour: '2-digit', 
          //   minute: '2-digit', 
          //   hour12: true 
          // });

          const formattedStartTime = moment(session.start_time, 'HH:mm:ss').format('h:mm A');

          // const formattedEndTime = sessionEndTime.toLocaleTimeString('en-US', { 
          //   hour: '2-digit', 
          //   minute: '2-digit', 
          //   hour12: true 
          // });

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
              student_id :session.student_id,
              session_name: session.session_name,
              bulk_session_id : session.id,
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
}, [selectedStudent]); // Dependency on selectedStudent


// ========================================================


   const studentOptions = studentData.map(student => ({
    label: `${student.first_name} ${student.last_name}`,
    value: student,
  }));


const validDate = formValue.date ? new Date(formValue.date) : null;
const selectedDate = validDate && !isNaN(validDate.getTime()) ? validDate : null;

 // Handle when an event is clicked
 const handleSessionClick = (event) => {
  setShowModalSession(true);
  console.log('Event clicked:', event);
  setSelectedEvent(event);

};

const handleCloseModalSession = () => {
  setShowModalSession(false); // Hide the modal
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
      
  
      // Log times for debugging
      console.log("Event Date:", eventDate);
      console.log("Start Time:", eventStartTime);
      console.log("End Time:", bulk_session_id);
    } else {
      // Fallback case if selectedEvent is not valid
      console.error("Invalid event data 1", selectedEvent);
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
      
         setShowModalSession(false); 
        toast.success("Session successfully deleted!", {
          position: "top-right",
          autoClose: 5000,
        });
     
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

  return (
    
    <div style={{ color: '#4979a0' }}>
      <ToastContainer />
      <h2>Calendar</h2>
      <Calendar
      localizer={localizer}
      events={[...events, ...Bulkevents]} 
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      view={view} // Controlled view based on state
      date={currentDate} // Set the current date for navigation
      onView={handleViewChange} // View change handler
      onNavigate={handleNavigate}
      onSelectEvent={handleSessionClick}
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
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            flex: 1, // Take the remaining space
          }}
        >
          {label}
        </div>
        {view != 'week' && (
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

          <div className="card flex justify-content-center" style={{ width: '225px' , margin:'-2px 10px' }}>
            <PrimeReactDropdown
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.value)}
              options={studentOptions}
              optionLabel="label"  // `label` corresponds to the full name of the student
              placeholder="Select a Student"
              // className="w-full md:w-14rem"
              // checkmark={true}
              highlightOnSelect={false}
            />
          </div>
      </div>

    ),
    
    // ==============Start of Add Session===========
    dateCellWrapper:userRollName === 'Provider' ? 
    
    ({ children, value }) => {
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
    //  ==========End of Add Session Click=======
  }}


/>

  

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
                <Dropdown title={selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Select Student'}>
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
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Date c</Form.ControlLabel>
                <DatePicker
                  
                  onChange={handleEndDateChangeBulk}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              </div>
              )}

              {/* ===================For Single ====================== */}
              {selectedValueRadio === "single" && (
              <div className="stu-pro-field-div">
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time S</Form.ControlLabel>
                  <TimePicker
                    value={StartTimeValue.time}
                    onChange={handleStartimeChange}
                    format="hh:mm a " 
                    showMeridian 
                  />
                </Form.Group>
               
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time S</Form.ControlLabel>
                 
                  <TimePicker
                    value={EndTimeValue.time}
                    onChange={handleEndtimeChange}
                    format="hh:mm a"
                    showMeridian 
                  />
                </Form.Group>
                
              </div>
              
              )}
               {/* ===================For Bulk ====================== */}
               {selectedValueRadio === "bulk" && (
               <div className="stu-pro-field-div">
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time B</Form.ControlLabel>
                  <TimePicker
                    value={StartTimeValueBulk.time}
                    onChange={handleStartimeChangeBulk}
                    format="hh:mm a " 
                    showMeridian 
                  />
                </Form.Group>
               
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time B</Form.ControlLabel>
                 
                  <TimePicker
                    value={EndTimeValueBulk.time}
                    onChange={handleEndtimeChangeBulk}
                    format="hh:mm a"
                  
                    showMeridian 
                  />
                </Form.Group>
              </div>
               )}
               
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              {selectedValueRadio === "bulk" && (
              <Button variant="primary" onClick={add_BulkSession}>Save changes B</Button>
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
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Date S</Form.ControlLabel>
                <DatePicker
                  format="yyyy-MM-dd"
                  value={selectedEvent.start ? new Date(selectedEvent.start) : null} disabled

                />
              </Form.Group>

              <div className="stu-pro-field-div">
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time C</Form.ControlLabel>
                 <Input className="rs_input_custom"  placeholder="Default Input"
                  value={startTimeConfirmSession  || "" } disabled
                />
              </Form.Group>
              <br/>
              <Form.Group controlId="time">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time C</Form.ControlLabel>
                
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
              <Button variant="primary">Confirm Session</Button>
            )}
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}

      
    </div>
  );
};

export default CalendarComponent;

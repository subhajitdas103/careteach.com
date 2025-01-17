import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'; // Importing the plus icon
import { Modal, Button } from 'react-bootstrap'; // Importing Bootstrap Modal
import { TimePicker ,DatePicker , Form , Dropdown } from 'rsuite';
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
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
        const sessionStartTime = new Date(`${session.date}T${session.start_time}Z`);
        const sessionEndTime = new Date(`${session.date}T${session.end_time}Z`);
       
        // Format start and end time in AM/PM format
        const formattedStartTime = sessionStartTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });

        const formattedEndTime = sessionEndTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });

        return {
          title: `${session.student_name} - ${formattedStartTime} - ${formattedEndTime}`,
          start: sessionStartTime, // Combined Date and start_time
          end: sessionEndTime,     // Combined Date and end_time
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
    setStartTimeValue({ time: value }); // Update time value
  };

  const handleEndtimeChange = (value) => {
    setEndTimeValue({ time: value }); // Update time value
  };
  // ===========For Bulk Session Add=============
  const [StartTimeValueBulk, setStartTimeValueBulk] = useState({ time: null });
  const [EndTimeValueBulk, setEndTimeValueBulk] = useState({ time: null });

  const handleStartimeChangeBulk = (value) => {
    setStartTimeValueBulk({ time: value }); // Update time value
  };

  const handleEndtimeChangeBulk = (value) => {
    setEndTimeValueBulk({ time: value }); // Update time value
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

console.log("vvv",formValue.date);
const SingleSessionChooseDate = formValue.date ? 
  new Date(formValue.date).getFullYear() + '-' + 
  String(new Date(formValue.date).getMonth() + 1).padStart(2, '0') + '-' + 
  String(new Date(formValue.date).getDate()).padStart(2, '0') 
  : null;


const SingleSessionStartTime = StartTimeValue.time ? StartTimeValue.time.toISOString().split('T')[1].split('.')[0] : null;
const SingleSessionEndTime = EndTimeValue.time ? EndTimeValue.time.toISOString().split('T')[1].split('.')[0] : null;
console.log("SingleSession Date",SingleSessionChooseDate);



  // =======================================
  const addSingleSession = async () => {
    const sessionData = {
        id: slectedStudentID,
        selected_student : SelectedStudentName,
        sessionType: selectedValueRadio,
        date: SingleSessionChooseDate,
        startTime: SingleSessionStartTime,
        endTime: SingleSessionEndTime ,
    };
    console.log(sessionData);
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
        alert('There was an error creating the session.');
    }
};


// =========================================================

const BulkSessionStartTime = StartTimeValueBulk.time ? StartTimeValueBulk.time.toISOString().split('T')[1].split('.')[0] : null;
const BulkSessionEndTime = EndTimeValueBulk.time ? EndTimeValueBulk.time.toISOString().split('T')[1].split('.')[0] : null;
const add_BulkSession = async () => {
  const sessionData = {
      id: slectedStudentID,
      selected_student : SelectedStudentName,
      sessionType: selectedValueRadio,
      dayofweek: dayofweek,
      startDate: selecteStartDateBulk,
      endDate: selecteEndDateBulk,
      startTime: BulkSessionStartTime,
      endTime: BulkSessionEndTime ,
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
// ========================================================


   const studentOptions = studentData.map(student => ({
    label: `${student.first_name} ${student.last_name}`,
    value: student,
  }));


const validDate = formValue.date ? new Date(formValue.date) : null;
const selectedDate = validDate && !isNaN(validDate.getTime()) ? validDate : null;
  return (
    
    <div style={{ color: '#4979a0' }}>
      <ToastContainer />
      <h2>Calendar</h2>
      <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      view={view} // Controlled view based on state
      date={currentDate} // Set the current date for navigation
      onView={handleViewChange} // View change handler
      onNavigate={handleNavigate} // Automatically handles navigation by updating the current date
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

        <div className="rbc-btn-group" style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => handleNavigate('PREV')}>Prev</button>
          <button onClick={() => handleNavigate('TODAY')}>Today</button>
          <button onClick={() => handleNavigate('NEXT')}>Next</button>
        </div>

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
    </div>
  );
};

export default CalendarComponent;

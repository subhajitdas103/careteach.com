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
  const [userRollName, setRollName] = useState(null);
// ============Getting Roll Name from Session=========
  useEffect(() => {
    const rollName = sessionStorage.getItem("authRollName");
      setRollName(rollName);
      console.log("Roll ID after refresh:", rollName);
    
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
        const response = await fetch('/api/Students/');
        const data = await response.json();
        console.log(data);
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    FetchStudentDetails();
  }, []);


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

  const [StartTimeValue, setStartTimeValue] = useState({ time: null });
  const [EndTimeValue, setEndTimeValue] = useState({ time: null });

  const handleStartimeChange = (value) => {
    setStartTimeValue({ time: value }); // Update time value
  };

  const handleEndtimeChange = (value) => {
    setEndTimeValue({ time: value }); // Update time value
  };

  const handleDateChange = (value) => {
    setFormValue({
      ...formValue,
      date: value,
    });
  };
  
  const handleSubmit = () => {
    // Handle form submission
    alert(`Selected Time: ${formValue.time}`);
  };
  const [selectedValueRadio, setSelectedValueRadio] = useState('single');
  const handleChange = (event) => {
    setSelectedValueRadio(event.target.value);
  };


  const [SelectedWorkingDays, setSelectedWorkingDays] = useState([]);
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
    setSelectedWorkingDays((prev) => 
      checked ? [...prev, name] : prev.filter(day => day !== name)
    );
  };
  const slectedStudentID = selectedStudent?.id || null;
const SelectedStudentName = selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : null;


const SingleSessionChooseDate = formValue.date ? new Date(formValue.date).toISOString().split('T')[0] : null;
const SingleSessionStartTime = StartTimeValue.time ? StartTimeValue.time.toISOString().split('T')[1].split('.')[0] : null;
const SingleSessionEndTime = EndTimeValue.time ? EndTimeValue.time.toISOString().split('T')[1].split('.')[0] : null;

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
        const response = await axios.post('/api/AddSingleSessions', sessionData);
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

   const studentOptions = studentData.map(student => ({
    label: `${student.first_name} ${student.last_name}`,
    value: student,
  }));
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
              top: '5px',
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
          
              <div className="card flex justify-content-center">
      <PrimeReactDropdown
        value={selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Select  Student'}
        onChange={(e) => handleStudentSelect(e.value)}
        placeholder="Choose Student"
      >
        {studentData.map((student, index) => (
          <PrimeReactDropdown.Item key={index} onClick={() => handleStudentSelect(student)}>
            {`${student.first_name} ${student.last_name}`}
          </PrimeReactDropdown.Item>
        ))}
      </PrimeReactDropdown>
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
                      {SelectedWorkingDays.length > 0 ? SelectedWorkingDays.join(', ') : 'Choose All That Apply'}
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
                                  checked={SelectedWorkingDays.includes(workingday)}
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
                  value={formValue.date}
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
                  value={formValue.date}
                  onChange={handleDateChange}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              <Form.Group controlId="date">
                <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Date</Form.ControlLabel>
                <DatePicker
                  value={formValue.date}
                  onChange={handleDateChange}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              </div>
              )}
              {/* ===================For Bulk ====================== */}
              <div className="stu-pro-field-div">
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">Start Time</Form.ControlLabel>
                  <TimePicker
                    value={StartTimeValue.time}
                    onChange={handleStartimeChange}
                    format="hh:mm a " 
                    showMeridian 
                  />
                </Form.Group>
               
                <Form.Group controlId="time">
                  <Form.ControlLabel className ="fontsizeofaddsessionmodal">End Time</Form.ControlLabel>
                 
                  <TimePicker
                    value={EndTimeValue.time}
                    onChange={handleEndtimeChange}
                    format="hh:mm a"
                    showMeridian 
                  />
                </Form.Group>
              </div>

            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              {selectedValueRadio === "bulk" && (
              <Button variant="primary" onClick={add_session}>Save changes B</Button>
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

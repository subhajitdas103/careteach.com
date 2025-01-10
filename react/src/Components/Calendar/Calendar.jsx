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
// Configure the calendar to use moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {

  
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
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    FetchStudentDetails();
  }, []);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
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
  return (
    <div style={{ color: '#4979a0' }}>
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
      </div>
    ),
    dateCellWrapper: ({ children, value }) => {
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
    },
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
              <label>Student</label>
            <Dropdown title={selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Select Student'}>
              {studentData.map((student, index) => (
                <Dropdown.Item key={index} onClick={() => handleStudentSelect(student)}>
                  {`${student.first_name} ${student.last_name}`}
                </Dropdown.Item>
              ))}
            </Dropdown>
    
            <Form.Group controlId="date">
                <Form.ControlLabel>Choose Date</Form.ControlLabel>
                <DatePicker
                  value={formValue.date}
                  onChange={handleDateChange}
                  format="yyyy-MM-dd" // Correct date format
                />
              </Form.Group>
              <div className="stu-pro-field-div">
                <Form.Group controlId="time">
                  <Form.ControlLabel>Start Time</Form.ControlLabel>
                  <TimePicker
                    value={StartTimeValue.time}
                    onChange={handleStartimeChange}
                    format="hh:mm a " 
                    showMeridian 
                  
                  />
                </Form.Group>

                <Form.Group controlId="time">
                  <Form.ControlLabel>End Time</Form.ControlLabel>
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
              <Button variant="primary">Save changes</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;

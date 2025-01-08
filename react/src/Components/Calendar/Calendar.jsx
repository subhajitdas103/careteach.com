import React, { useState , useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

// Configure the calendar to use moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Sample events
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

  // Sample student list
  const [students] = useState([
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
  ]);

  // State to track the current view and date
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to handle view changes
  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  // Function to handle navigation (Prev, Today, Next)
  const handleNavigate = (action) => {
    const current = new Date(currentDate);
    if (action === 'PREV') {
      current.setMonth(current.getMonth() - 1); // Move to previous month
    } else if (action === 'NEXT') {
      current.setMonth(current.getMonth() + 1); // Move to next month
    } else if (action === 'TODAY') {
      // Reset to today's date and update the month view
      const today = new Date();
      setCurrentDate(today); // Set the current date to today
      // Set the calendar view to current month when Today is clicked
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


console.log("all_student",studentData)
const handleStudentSelect = (student) => {
  setSelectedStudent(student);
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
              {/* Left side: View buttons (Month, Week, Day, Agenda) */}
              <div className="rbc-btn-group">
                <button onClick={() => setView('month')}>Month</button>
                <button onClick={() => setView('week')}>Week</button>
                <button onClick={() => setView('day')}>Day</button>
                <button onClick={() => setView('agenda')}>Agenda</button>
              </div>

              {/* Center: Month name */}
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

              {/* Right side: Navigation buttons (Prev, Today, Next) */}
              <div className="rbc-btn-group" style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => handleNavigate('PREV')}>Prev</button>
                <button onClick={() => handleNavigate('TODAY')}>Today</button>
                <button onClick={() => handleNavigate('NEXT')}>Next</button>

                {/* Student Dropdown */}
                <div className="dropdown" style={{ marginLeft: '10px' }}>
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                   {selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Select Student'}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {studentData.map((student, index) => (
                      <li key={index}>
                     <span
                        className="dropdown-item custom-dropdown-item"
                        onClick={() => handleStudentSelect(student)} // Update selected student on click
                      >
                        {student.first_name} {student.last_name}
                      </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CalendarComponent;

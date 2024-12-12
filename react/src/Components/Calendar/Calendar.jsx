import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./Calendar.css";

// Configure the calendar to use moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
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

  return (
    <div style={{ color: '#4979a0'  }}>
    <h2>Calendar</h2>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
  
  );
};

export default CalendarComponent;

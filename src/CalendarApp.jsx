import React, { useState } from 'react';
import dayjs from 'dayjs';
import eventsData from './events.json';
import './App.css';

const CalendarApp = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showMonthList, setShowMonthList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = dayjs().startOf('day');
  const startDay = currentMonth.startOf('month').day();
  const daysInMonth = currentMonth.daysInMonth();
  const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
  const currentYear = currentMonth.year();

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const isEventPassed = (eventDate, eventTime) => {
    if (!eventTime) return false;
    const eventDateTime = dayjs(`${eventDate} ${eventTime}`, 'YYYY-MM-DD hh:mm A');
    return dayjs().isAfter(eventDateTime);
  };

  const renderLeftPanel = () => {
    const todayEvents = eventsData.filter(event =>
      dayjs(event.date).isSame(today, 'day')
    );
    const birthdays = eventsData.filter(event =>
      event.type === 'birthday' &&
      dayjs(event.date).format('MM-DD') === today.format('MM-DD')
    );
    const monthEvents = eventsData.filter(event =>
      dayjs(event.date).isSame(currentMonth, 'month')
    );

    return (
      <div className="left-panel">
        <h2>Events in {currentMonth.format('MMMM YYYY')}</h2>
        <ul>
          {monthEvents.map((event, i) => (
            <li key={i} className={isEventPassed(event.date, event.time) ? 'passed-event' : ''}>
              {dayjs(event.date).format('MMM D')}: {event.title} {event.time || ''}
            </li>
          ))}
        </ul>

        <h3>Today's Birthdays</h3>
        <ul>
          {birthdays.length === 0 ? (
            <li>No birthdays today</li>
          ) : (
            birthdays.map((b, i) => (
              <li key={i} className="birthday">{b.title}</li>
            ))
          )}
        </ul>
      </div>
    );
  };

  const renderEvents = (date) => {
    return eventsData.filter(event => {
      if (event.type === 'birthday') {
        return dayjs(event.date).format('MM-DD') === date.format('MM-DD');
      }
      return dayjs(event.date).isSame(date, 'day');
    }).map((event, i) => (
      <div key={i} className={`event ${event.type === 'birthday' ? 'birthday' : ''}`}>
        {event.time ? `${event.time} - ${event.title}` : `🎉 ${event.title}`}
      </div>
    ));
  };

  const renderMonthDropdown = () => (
    <div className="dropdown-overlay">
      {monthNames.map((month, idx) => (
        <div key={idx} className="dropdown-item" onClick={() => {
          setCurrentMonth(currentMonth.month(idx));
          setShowMonthList(false);
        }}>{month}</div>
      ))}
    </div>
  );

  const renderYearDropdown = () => {
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    return (
      <div className="dropdown-overlay">
        {years.map((year, i) => (
          <div key={i} className="dropdown-item" onClick={() => {
            setCurrentMonth(currentMonth.year(year));
            setShowYearList(false);
          }}>{year}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-layout">
      {renderLeftPanel()}

      <div className="right-panel">
        <div className="calendar-header">
          <div className="calendar-date">{today.format('dddd, MMMM D, YYYY')}</div>
          <button className="add-event-btn">Add Event</button>
        </div>

        <div className="calendar-container">
          <div className="header centered">
            <div className="month-year-selector dropdown-wrapper">
              <span className="clickable" onClick={() => setShowMonthList(!showMonthList)}>
                {currentMonth.format('MMMM')}
              </span>
              <span className="clickable" onClick={() => setShowYearList(!showYearList)}>
                {currentMonth.format('YYYY')}
              </span>
              {showMonthList && renderMonthDropdown()}
              {showYearList && renderYearDropdown()}
            </div>
            <div>
              <button onClick={prevMonth}>&lt;</button>
              <button onClick={nextMonth}>&gt;</button>
            </div>
          </div>

          <div className="calendar-grid-box">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="weekday-box">{d}</div>
            ))}

            {[...Array(startDay)].map((_, i) => (
              <div key={`empty-${i}`} className="empty-box" />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const date = currentMonth.date(i + 1);
              const isToday = date.isSame(today, 'day');
              const isSelected = selectedDate && date.isSame(selectedDate, 'day');
              return (
                <div
                  key={i}
                  className={`day-box ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="date-number">{i + 1}</div>
                  <div className="events">
                    {renderEvents(date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;

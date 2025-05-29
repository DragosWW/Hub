import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css';
import { useEvents } from '../context/EventContext';

require('moment/locale/ro');
moment.locale('ro');
const localizer = momentLocalizer(moment);

const groupColorMapping = {
  'Muzică': '#007bff',
  'Teatru': '#6f42c1',
  'Artă': '#fd7e14',
  'Film': '#dc3545',
  'Literatură': '#17a2b8',
  'Stand-up': '#20c997',
  'Caritabil': '#ffc107',
  'Tradiții': '#6610f2', 
  'Board Games': '#28a745',
};

function CalendarPage() {
  const { events, isEventAdded } = useEvents();
  const navigate = useNavigate();

  const uniqueGroups = useMemo(() => {
     if (!events) return [];
     const groups = new Set(events.map(event => event.grup));
     return Array.from(groups).sort();
   }, [events]);

  const calendarEvents = useMemo(() => {
    if (!events) return [];
    return events.map(event => ({
      id: event.id,
      title: event.nume,
      start: new Date(event.data),
      end: event.dataSfarsit ? new Date(event.dataSfarsit) : new Date(event.data),
      allDay: !!event.dataSfarsit && (new Date(event.dataSfarsit).getTime() - new Date(event.data).getTime()) / (1000 * 60 * 60) >= 23.9,
      resource: event,
      isAdded: isEventAdded(event.id)
    }));
  }, [events, isEventAdded]);

  const eventPropGetter = (event, start, end, isSelected) => {
    let classNames = 'custom-rbc-event';

    if (event.resource && event.resource.grup) {
      const groupSlug = event.resource.grup.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      classNames += ` event-group-${groupSlug}`;
    }

    if (event.isAdded) {
      classNames += ' highlighted-event';
    }
    
    if (isSelected) {
        classNames += ' selected-event';
    }

    const tooltipText = `${event.title}\nData: ${moment(event.start).format('LLL')}\nLocație: ${event.resource.locatie || 'Nespecificată'}`;

    return { 
      className: classNames.trim(),
      title: tooltipText
    };
  };

  const handleSelectEvent = (calendarEvent) => {
    if (calendarEvent.resource && calendarEvent.resource.id) {
      navigate(`/eveniment/${calendarEvent.resource.id}`);
    }
  };

  return (
    <div className="calendar-page-container">
      <h1 className="calendar-page-title">Calendar Interactiv Evenimente</h1>

      <div className="calendar-legend">
        <span className="legend-title">Legenda Grupuri:</span>
        {uniqueGroups.map(group => (
          <div key={group} className="legend-item">
            <span 
              className="legend-color-box" 
              style={{ backgroundColor: groupColorMapping[group] || '#777' }}
            ></span>
            {group}
          </div>
        ))}
        <div className="legend-item">
           <span className="legend-color-box highlighted-indicator">✔</span>
           Adăugat în Calendar
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        className="custom-calendar-style"
        style={{ flexGrow: 1, marginTop: '20px' }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleSelectEvent}
        messages={{
          next: "Următor", previous: "Anterior", today: "Azi",
          month: "Lună", week: "Săptămână", day: "Zi", agenda: "Agendă",
          date: "Data", time: "Ora", event: "Eveniment",
          noEventsInRange: "Nu există evenimente în acest interval."
        }}
        selectable
        popup
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
}

export default CalendarPage;
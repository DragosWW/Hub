import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import moment from 'moment';
import 'moment/locale/ro';
import './UserSavedEventsList.css'; 

function UserSavedEventsList() {
  const { events, addedEventIds, removeEventFromCalendar, isLoadingAddedEvents } = useEvents();
  moment.locale('ro');

  
  const mySavedEventsDetails = React.useMemo(() => {
    if (!events || !addedEventIds) return [];
    return events.filter(event => addedEventIds.has(event.id));
  }, [events, addedEventIds]);

  if (isLoadingAddedEvents) {
    return <p className="loading-saved-events">Se încarcă evenimentele salvate...</p>;
  }

  if (mySavedEventsDetails.length === 0) {
    return <p className="no-saved-events">Nu ai niciun eveniment salvat în calendar încă.</p>;
  }

  return (
    <div className="user-saved-events-container">
      {mySavedEventsDetails.map(event => (
        <div key={event.id} className="saved-event-card">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.nume} className="saved-event-image" />
          ) : (
            <div className="saved-event-image-placeholder">
              {event.grup ? event.grup.charAt(0) : 'E'}
            </div>
          )}
          <div className="saved-event-info">
            <h4 className="saved-event-title">
              <Link to={`/eveniment/${event.id}`}>{event.nume}</Link>
            </h4>
            <p className="saved-event-date">
              {moment(event.data).format('D MMMM YYYY, HH:mm')}
            </p>
            <p className="saved-event-location">{event.locatie}</p>
          </div>
          <button 
            onClick={() => removeEventFromCalendar(event.id)}
            className="remove-event-button"
            title="Elimină din calendar"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

export default UserSavedEventsList;
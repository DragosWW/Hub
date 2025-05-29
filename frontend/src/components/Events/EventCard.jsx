
import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import './EventCard.css';

function EventCard({ event }) {
  const { addEventToCalendar, removeEventFromCalendar, isEventAdded } = useEvents();
  const eventIsAdded = isEventAdded(event.id);

  const handleToggleEvent = () => {
    if (eventIsAdded) {
      removeEventFromCalendar(event.id);
    } else {
      addEventToCalendar(event.id);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };


  return (
    <div className="event-card">
      <Link to={`/eveniment/${event.id}`} className="event-card-image-link">
        <img
  src={event.imageUrl || '/images/events/default-event.png'}
  alt={event.nume}
  className="event-card-image"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/images/events/default-event.png';
  }}
/>

      </Link>
      <div className="event-card-content">
        <h3 className="event-card-title">
          <Link to={`/eveniment/${event.id}`} className="event-title-link">
            {event.nume}
          </Link>
        </h3>
        <p className="event-card-detail">
          <span role="img" aria-label="calendar icon">📅</span> <strong>Data:</strong> {formatDate(event.data)}
        </p>
        {event.dataSfarsit && (
          <p className="event-card-detail">
            <span role="img" aria-label="calendar icon">📅</span> <strong>Până la:</strong> {formatDate(event.dataSfarsit)}
          </p>
        )}
        <p className="event-card-detail">
          <span role="img" aria-label="group icon">👥</span> <strong>Grup:</strong> {event.grup}
        </p>
        <p className="event-card-location">
          <span role="img" aria-label="location icon">📍</span> <strong>Locație:</strong> {event.locatie}
        </p>
        {}
        {event.pretBilet && (
          <p className="event-card-price">
            <span role="img" aria-label="ticket icon">🎫</span> <strong>Preț:</strong> {event.pretBilet}
          </p>
        )}
        <p className="event-card-description">{event.descriere ? event.descriere.substring(0, 100) + (event.descriere.length > 100 ? "..." : "") : "Fără descriere."}</p>
      </div>
      <div className="event-card-actions">
        <Link to={`/eveniment/${event.id}`} className="event-card-details-button">
          Vezi Detalii
        </Link>
        <button
          onClick={handleToggleEvent}
          className={`event-card-button ${eventIsAdded ? 'event-card-button-added' : 'event-card-button-add'}`}
        >
          {eventIsAdded ? 'Adăugat ✔' : 'Adaugă în Calendar'}
        </button>
      </div>
    </div>
  );
}

export default EventCard;
// frontend/src/pages/EventDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import './EventDetailPage.css'; // Importă fișierul CSS

function EventDetailPage() {
  const { eventId } = useParams();
  const { events, addEventToCalendar, removeEventFromCalendar, isEventAdded } = useEvents();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="event-not-found-container">
        <h2>Eveniment Negăsit</h2>
        <p>Oops! Se pare că evenimentul pe care îl cauți nu există sau URL-ul este incorect.</p>
        <Link to="/">Înapoi la Pagina Principală</Link>
      </div>
    );
  }

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

  // Placeholder pentru imagine dacă nu există event.imageUrl
  const imagePlaceholder = (
    <div className="event-detail-image-placeholder">
      {event.nume.substring(0, 30)}... {/* Sau o iconiță specifică grupului */}
    </div>
  );

  return (
    <div className="event-detail-container">
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.nume} className="event-detail-image" />
      ) : (
        imagePlaceholder
      )}

      <h1 className="event-detail-title">{event.nume}</h1>
      
      <div className="event-detail-meta">
        <p className="event-detail-group">
          <span role="img" aria-label="group icon">👥</span>
          <strong>Grup:</strong> {event.grup}
        </p>
        <p className="event-detail-date">
          <span role="img" aria-label="calendar icon">📅</span>
          <strong>Data:</strong> {formatDate(event.data)}
          {event.dataSfarsit && ` - ${formatDate(event.dataSfarsit)}`}
        </p>
        <p className="event-detail-location">
          <span role="img" aria-label="location icon">📍</span>
          <strong>Locație:</strong> {event.locatie}
        </p>
      </div>
      
      <div className="event-detail-description">
        <h3>Descriere Detaliată:</h3>
        <p>{event.descriere || "Nicio descriere detaliată disponibilă."}</p>
      </div>

      <div className="event-detail-actions">
        <button 
          onClick={handleToggleEvent}
          className={`event-detail-button ${eventIsAdded ? 'button-added' : 'button-add'}`}
        >
          {eventIsAdded ? 'Elimină din Calendar ✔' : 'Adaugă în Calendar'}
        </button>
        <Link to="/" className="event-detail-back-button">
          Înapoi la Listă
        </Link>
      </div>
    </div>
  );
}

export default EventDetailPage;
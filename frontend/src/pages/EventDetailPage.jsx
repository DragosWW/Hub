import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTags, FaInfoCircle } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/ro'; 
import './EventDetailPage.css'; 

function EventDetailPage() {
  const { eventId } = useParams();
  const { events, addEventToCalendar, removeEventFromCalendar, isEventAdded } = useEvents();

  moment.locale('ro'); 


  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="event-not-found-container">
        <h2>Eveniment Negăsit</h2>
        <p>Oops! Se pare că evenimentul pe care îl cauți nu există sau URL-ul este incorect.</p>
        <Link to="/" className="button-primary"> 
          Înapoi la Pagina Principală
        </Link>
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

  
  const imagePlaceholder = (
    <div className="event-detail-image-placeholder">
      
      {event.nume ? event.nume.substring(0, 30) + (event.nume.length > 30 ? "..." : "") : (event.grup ? event.grup.charAt(0) : "E")}
    </div>
  );

  return (
    <div className="event-detail-page-container"> 
      {event.imageUrl ? (
        <div className="event-detail-image-container"> 
          <img src={event.imageUrl} alt={event.nume} className="event-detail-image" />
        </div>
      ) : (
        <div className="event-detail-image-container">
          {imagePlaceholder}
        </div>
      )}

      <div className="event-detail-content-wrapper"> 
        <h1 className="event-detail-title">{event.nume}</h1>
        
        <div className="event-detail-meta">
          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span>
              {moment(event.data).format('dddd, D MMMM YYYY, HH:mm')}
              {event.dataSfarsit && ` - ${moment(event.dataSfarsit).format('LLLL')}`}
            </span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <span>{event.locatie}</span>
          </div>
          {event.grup && (
            <div className="info-item">
              <FaTags className="info-icon" /> 
              <span>Categorie: {event.grup}</span>
            </div>
          )}
          {event.pretBilet && (
            <div className="info-item">
              <FaTicketAlt className="info-icon" /> 
              <span>Preț Bilet: {event.pretBilet}</span>
            </div>
          )}
        </div>

        {event.descriere && (
          <div className="event-detail-description">
            <h3><FaInfoCircle style={{marginRight: '8px', verticalAlign: 'middle'}} />Descriere Detaliată:</h3>
            
            {event.descriere.split('\n').map((paragraf, index) => (
              <p key={index}>{paragraf.trim() ? paragraf : <br />}</p> 
            ))}
          </div>
        )}

        <div className="event-detail-actions">
          <button 
            onClick={handleToggleEvent}
            className={`event-detail-button ${eventIsAdded ? 'button-added' : 'button-add'}`}
          >
            {eventIsAdded ? 'Elimină din Calendar ✔' : 'Adaugă în Calendar'}
          </button>
          <Link to="/" className="event-detail-button button-secondary"> 
            Înapoi la Evenimente
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
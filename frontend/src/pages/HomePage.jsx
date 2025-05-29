
import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/Events/EventCard';
import './HomePage.css';
import brasovImage from '../assets/brasov-panoramic.jpg'; 

function HomePage() {
  const { events } = useEvents();
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueGroups = useMemo(() => {
    if (!events) return [];
    const groups = new Set(events.map(event => event.grup));
    return Array.from(groups).sort();
  }, [events]);

  const handleGroupToggle = (groupName) => {
    setSelectedGroups(prev => {
      const next = new Set(prev);
      next.has(groupName) ? next.delete(groupName) : next.add(groupName);
      return next;
    });
  };

  const clearGroupFilters = () => setSelectedGroups(new Set());

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter(e => selectedGroups.size === 0 || selectedGroups.has(e.grup))
      .filter(e => e.nume.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [events, selectedGroups, searchTerm]);

  if (!events || events.length === 0) {
    return <p className="no-events-message">Nu există evenimente disponibile momentan.</p>;
  }

  return (
    <div className="homepage-container">
     
      <section
        className="homepage-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 90, 139, 0.7), rgba(2, 90, 139, 0.7)), url(${brasovImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '0 0 15px 15px',
          marginBottom: '40px',
        }}
      >
        <h1 className="homepage-title">Descoperă Evenimentele din Brașov</h1>
        <p className="homepage-subtitle">Găsește și explorează activitățile culturale și de divertisment.</p>
      </section>

      
      <div className="filters-section-wrapper">
        <div className="filters-container">
          <div className="filter-group-container">
            <h4>Filtrează după Grup:</h4>
            <div className="group-filter-buttons">
              {uniqueGroups.map(group => (
                <button
                  key={group}
                  onClick={() => handleGroupToggle(group)}
                  className={`filter-button ${selectedGroups.has(group) ? 'filter-button-active' : ''}`}
                >
                  {group}
                </button>
              ))}
              {selectedGroups.size > 0 && (
                <button onClick={clearGroupFilters} className="filter-button clear-filters-button">
                  Resetează Filtre
                </button>
              )}
            </div>
          </div>

          <div className="search-group">
            <label htmlFor="search-filter">Caută după titlu:</label>
            <input
              type="text"
              id="search-filter"
              placeholder="Ex: Concert, Teatru..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      
      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="no-events-message">
          Nu s-au găsit evenimente care să corespundă criteriilor selectate.
        </p>
      )}
    </div>
  );
}

export default HomePage;

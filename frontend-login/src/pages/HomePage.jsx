import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/Events/EventCard';
import './HomePage.css'; // Importă fișierul CSS

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
    setSelectedGroups(prevSelectedGroups => {
      const newSelectedGroups = new Set(prevSelectedGroups);
      if (newSelectedGroups.has(groupName)) {
        newSelectedGroups.delete(groupName);
      } else {
        newSelectedGroups.add(groupName);
      }
      return newSelectedGroups;
    });
  };

  const clearGroupFilters = () => {
    setSelectedGroups(new Set());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    let S_events = events;

    if (selectedGroups.size > 0) {
      S_events = S_events.filter(event => selectedGroups.has(event.grup));
    }

    if (searchTerm.trim() !== '') {
      S_events = S_events.filter(event =>
        event.nume.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return S_events;
  }, [events, selectedGroups, searchTerm]);


  if (!events || events.length === 0) {
    return <p className="no-events-message">Nu există evenimente disponibile momentan.</p>;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Evenimente Viitoare</h1>

      <div className="filters-section"> {/* Nume nou pentru containerul filtrelor */}
        <div className="filters-top-row"> {/* Container pentru grupuri și search */}
          <div className="filter-group-container"> {/* Container specific pentru filtrele de grup */}
            <h4>Filtrează după Grup:</h4>
            <div className="group-filter-buttons">
              {uniqueGroups.map(groupName => (
                <button
                  key={groupName}
                  onClick={() => handleGroupToggle(groupName)}
                  className={`filter-button ${selectedGroups.has(groupName) ? 'filter-button-active' : ''}`}
                >
                  {groupName}
                </button>
              ))}
              {selectedGroups.size > 0 && (
                <button 
                  onClick={clearGroupFilters} 
                  className="filter-button clear-filters-button"
                >
                  Resetează Filtre Grup
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
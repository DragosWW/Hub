import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Pentru a accesa starea de autentificare (token, currentUser)
import authService from '../services/authService'; // Pentru apeluri API legate de evenimentele salvate ale userului

// Date statice inițiale pentru evenimente - acestea ar trebui preluate dintr-un API în viitor
const initialEvents = [
  { id: '1', nume: 'Concert Jazz Fusion', data: '2025-06-10T19:00:00', grup: 'Muzică', descriere: 'O seară de jazz fusion cu artiști renumiți.', locatie: 'Clubul de Jazz "Blue Note"' },
  { id: '2', nume: 'Piesă de Teatru "Furtuna"', data: '2025-06-15T20:30:00', grup: 'Teatru', descriere: 'O interpretare clasică a capodoperei shakespeariene.', locatie: 'Teatrul Național "Scena Mare"' },
  { id: '3', nume: 'Expoziție Fotografie Documentară', data: '2025-06-20T10:00:00', grup: 'Artă', descriere: 'Fotografii ce surprind realități sociale contemporane.', locatie: 'Galeria de Artă "Focus"', dataSfarsit: '2025-07-20T18:00:00' },
  { id: '4', nume: 'Festival de Film European', data: '2025-07-01T18:00:00', grup: 'Film', descriere: 'Selecție a celor mai bune filme europene ale anului.', locatie: 'Cinema "Europa"', dataSfarsit: '2025-07-05T23:00:00'},
  { id: '5', nume: 'Atelier de Pictură în Acuarelă', data: '2025-06-12T14:00:00', grup: 'Artă', descriere: 'Învață tehnicile de bază ale picturii în acuarelă.', locatie: 'Centrul Comunitar "Creativ"'},
  { id: '6', nume: 'Seară de Poezie Contemporană', data: '2025-06-28T19:30:00', grup: 'Literatură', descriere: 'Recital de poezie cu autori tineri.', locatie: 'Cafeneaua Literară "Versuri"'}
];

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents); // Lista tuturor evenimentelor (momentan statica)
  const [addedEventIds, setAddedEventIds] = useState(new Set()); // Set cu ID-urile evenimentelor adăugate de utilizator
  const [isLoadingAddedEvents, setIsLoadingAddedEvents] = useState(false); // Stare de încărcare pentru evenimentele salvate
  
  const { token, currentUser } = useAuth(); // Preluăm token-ul și userul din AuthContext

  // Funcție memoizată pentru a încărca evenimentele salvate ale utilizatorului
  const fetchUserSavedEvents = useCallback(async () => {
    if (token && currentUser) { // Doar dacă utilizatorul este logat
      setIsLoadingAddedEvents(true);
      console.log('EventContext: Se încarcă evenimentele salvate pentru utilizator...');
      try {
        // Presupunând că authService.getUserSavedEvents() este implementat corect
        const savedIdsArray = await authService.getUserSavedEvents(); 
        setAddedEventIds(new Set(savedIdsArray || []));
        console.log('EventContext: Evenimente salvate încărcate:', savedIdsArray);
      } catch (error) {
        console.error("EventContext: Nu s-au putut încărca evenimentele salvate:", error);
        setAddedEventIds(new Set()); // Resetează la gol în caz de eroare
      } finally {
        setIsLoadingAddedEvents(false);
      }
    } else {
      // Dacă nu e user logat sau token-ul dispare, resetează evenimentele salvate
      // console.log('EventContext: Niciun utilizator logat, se resetează evenimentele salvate.');
      setAddedEventIds(new Set());
      setIsLoadingAddedEvents(false); 
    }
  }, [token, currentUser]); 

  // Efect pentru a încărca evenimentele salvate la montarea componentei sau la schimbarea utilizatorului/token-ului
  useEffect(() => {
    fetchUserSavedEvents();
  }, [fetchUserSavedEvents]); // Acum depinde de funcția memoizată

  const addEventToCalendar = async (eventId) => {
    if (!token) {
      alert("Te rugăm să te loghezi pentru a salva evenimente în calendarul tău.");
      // Aici ai putea redirecta la pagina de login, de ex. folosind useNavigate din react-router-dom
      // const navigate = useNavigate(); navigate('/login'); (dar hook-urile se pot apela doar în componente)
      // O soluție mai bună ar fi ca componenta care apelează addEventToCalendar să facă redirectarea.
      return;
    }
    
    try {
      // Actualizare optimistă (opțional, pentru UX mai bun)
      // const oldAddedEventIds = new Set(addedEventIds);
      // setAddedEventIds(prevIds => new Set(prevIds).add(eventId));

      const updatedSavedEvents = await authService.addEventToUserCalendar(eventId); // Apel API
      setAddedEventIds(new Set(updatedSavedEvents)); // Actualizează cu răspunsul de la server
    } catch (error) {
      console.error("EventContext: Eroare la adăugarea evenimentului:", error);
      // Revert optimistic update dacă a eșuat (dacă ai implementat)
      // setAddedEventIds(oldAddedEventIds);
      alert("Nu s-a putut adăuga evenimentul. Te rugăm să încerci din nou.");
    }
  };

  const removeEventFromCalendar = async (eventId) => {
    if (!token) return; // Nu se poate șterge dacă nu e logat

    try {
      // Actualizare optimistă (opțional)
      // const oldAddedEventIds = new Set(addedEventIds);
      // setAddedEventIds(prevIds => {
      //   const newIds = new Set(prevIds);
      //   newIds.delete(eventId);
      //   return newIds;
      // });

      const updatedSavedEvents = await authService.removeEventFromUserCalendar(eventId); // Apel API
      setAddedEventIds(new Set(updatedSavedEvents)); // Actualizează cu răspunsul de la server
    } catch (error) {
      console.error("EventContext: Eroare la ștergerea evenimentului:", error);
      // Revert optimistic update (dacă ai implementat)
      // setAddedEventIds(oldAddedEventIds);
      alert("Nu s-a putut șterge evenimentul. Te rugăm să încerci din nou.");
    }
  };

  const isEventAdded = (eventId) => {
    return addedEventIds.has(eventId);
  };

  // Valorile furnizate de context
  const value = {
    events, // Lista tuturor evenimentelor
    setEvents, // Dacă vrei să permiți modificarea listei de evenimente din exterior
    addedEventIds,
    addEventToCalendar,
    removeEventFromCalendar,
    isEventAdded,
    isLoadingAddedEvents // Stare pentru a arăta un indicator de încărcare dacă e nevoie
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

// Hook custom pentru a folosi contextul evenimentelor
export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents trebuie folosit în interiorul unui EventProvider');
  }
  return context;
};
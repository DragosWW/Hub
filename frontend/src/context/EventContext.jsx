import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; 
import authService from '../services/authService'; 

const initialEvents = [
    {
    id: 'teo-standup-reduta-20250601',
    nume: 'Teo - Scos din context | Stand Up Comedy Show',
    data: '2025-06-01T19:00:00', 
    grup: 'Stand-up', 
    descriere: 'Un show despre vârtejul din vremurile noastre, despre tatuaje, tradiții, mămăligă și despre conspirațiile din spatele conspirațiilor tale preferate.Poate conține albine și extratereștri.Cu o experiență remarcabilă pe scenă, începând cu cea de club, până la spectacole și turnee în țară și în afară și special-uri de stand-up, Teo este pregătit să discute despre tot, de la natura umană, la mărunțișurile de zi cu zi. Toate astea în timp ce te va face să râzi cu lacrimi.',
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/teo-scos-din-context.jpg',
    pretBilet: " de la 83 lei"
  },
    {
    id: 'catan', 
    nume: 'Turneu Catan - Cucerește insula',
    data: '2025-05-31T11:00:00', 
    dataSfarsit: '2025-06-01T23:00:00',
    grup: 'Board Games', 
    descriere: 'Board Games Community Sibiu, alături de Puzzle Punk Brașov, te invită la o confruntare strategică pentru resurse, glorie și... 1000 de lei! Vino să cucerești Insula de 1000 de Lei în Turneul Catan al Verii, ce va avea loc în perioada 31 mai – 1 iunie.',
    locatie: 'Puzzle Punks',
    imageUrl: '/images/events/Catan.png',
  },
    {
    id: 'milea-radu-bucalae-20240622', 
    nume: 'Stand-up Comedy politic cu SERGHEI - "Eu cu cine am votat?',
    data: '2025-06-22T19:00:00', 
    grup: 'Stand-up', 
    descriere: 'Ai votat și acum te întrebi ce-ai făcut sau dacă a meritat efortul? Ești curios să vezi ce s-a ales, până la urmă, de opțiunile tale? Ei bine, Serghei revine să facă bilanțul (în stilul lui!). Hai la show să râdem împreună de ce-a urmat după alegeri și la final îți promit că poate tot n-o să fii complet lămurit cu cine ai votat, dar măcar mergi acasă râzând.', 
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/serghei-standup.png', 
    pretBilet: " de la 73.01 lei" 
  },
   {
    id: 'sotie-de-imprumut-20240615', 
    nume: 'Soție de împrumut',
    data: '2025-06-15T19:00:00', 
    grup: 'Teatru', 
    descriere: 'O dilemă de zile mari. Când relația cu femeia ideală devine prea frumoasă, prea dulce, prea roz, iar armonia din cuplu tinde să distrugă legătura cu cel mai bun și iresponsabil prieten din câți există, ce alegi? Fiara sau prietenul? Sunteți invitați la rezolvarea unei dileme existențiale în cea mai nouă comedie.',
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/sotie-de-imprumut.png', 
    pretBilet: " de la 133.64 lei" 
  },
    {
    id: 'alternosfera-theatroll-brasov-20240531', 
    nume: 'Alternosfera - Theatroll | Lansare Album & Turneu Național',
    data: '2025-05-31T21:00:00', 
    grup: 'Muzică', 
    descriere: 'Nosferatu - Eine Symphonie des Grauens, de F. W. Murnau (1922), este unul din cele mai importante filme mute. Muzica originală s-a pierdut, așa că s-au făcut nenumărate partituri pentru el și este un favorit live al festivalurilor de film și nu numai.Dar niciodată nu s-a cântat Blues pe el. un blues mai psihedelic, dar ce blues, Bluesferatu !!!', 
    locatie: 'Kruhnen Musik Halle, Brașov',
    imageUrl: '/images/events/alternosfera-theatroll-brasov.png', 
    pretBilet: " de la 134.16 lei " 
  },
    {
    id: 'gala-caritabila-suflet-20250915', 
    nume: 'Gala Caritabilă "Alături de Voi"', 
    data: '2025-09-15T19:30:00', 
    grup: 'Caritabil', 
    descriere: "Un eveniment caritabil cu suflet, eleganță și muzică de excepție, organizat pentru a sprijini [Completează Numele Cauzei/Organizației Sprijinite]. Vă așteptăm să fiți parte dintr-o seară memorabilă și să contribuiți la o cauză nobilă.",
    locatie: 'Conacul Albert',
    imageUrl: '/images/events/gala-caritabila-suflet.png', 
  },
    {
    id: 'hans-zimmer-tribute-brasov-20241125', 
    nume: 'The Music of Hans Zimmer & Others - A Tribute to the Film Maestro',
    data: '2025-11-25T20:00:00', 
    grup: 'Muzică', 
    descriere: 'Renumita orchestră simfonică „Lords of the Sound” prezintă programul muzical „The Music of Hans Zimmer”, care reunește cele mai celebre compoziții ale geniului muzical al vremurilor noastre, Hans Zimmer!„The Music of Hans Zimmer” este o călătorie captivantă în lumea sunetelor unice, aducând pe scenă atmosfera extraordinară a capodoperelor cinematografice prin interpretarea unei orchestre simfonice.Hans Zimmer este unul dintre cei mai influenți și importanți creatori de coloane sonore ale cinematografiei contemporane. S-a impus ca un maestru al muzicii epice, realizând acompaniamente muzicale de neuitat pentru numeroase blockbustere internaționale..', // Poți adăuga o descriere mai detaliată.
    locatie: 'Sala Sporturilor "D.P. Colibași", Brașov',
    imageUrl: '/images/events/hans-zimmer-tribute-brasov.png', 
    pretBilet: " de la 149 lei" 
  },
  {
    id: 'prime-orchestra-brasov-20241117', 
    nume: 'PRIME ORCHESTRA - Rock Sympho Show',
    data: '2025-11-17T20:00:00', 
    grup: 'Muzică', 
    descriere: 'Simte puterea rockului și măreția muzicii simfonice în noul ROCK Sympho Show al legendarei PRIME Orchestra, care celebrează 10 ani de spectacole muzicale extraordinare!', 
    locatie: 'Sala Sporturilor "D.P. Colibași", Brașov',
    imageUrl: '/images/events/prime-orchestra-rock-sympho-brasov.jpg', 
    pretBilet: " de la 129 lei" 
  },
    {
    id: 'taxi-blues-brasov-20240604', 
    nume: 'TAXI BLUES de Ana Maria Nistor',
    data: '2025-06-04T19:00:00', 
    grup: 'Teatru', 
    descriere: 'O comedie savuroasă despre dragoste, prietenie și dorința de a avea tot ce e mai bun pe lume fără niciun sacrificiu.Iată personajele: un bărbat de vârsta mijlocie, care și-a ratat toate șansele în viață, fostul lui coleg de liceu care pare să aibă tot ce-și poate dori și soția acestuia, o intelectuală cu multe regrete, dar plină de dorința de a iubi.Ei sunt protagoniștii care te vor face sa râzi până la lacrimi.',
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/taxi-blues-brasov.png', 
    pretBilet: " de la 103.31 lei" 
  },
  {
    id: 'simion-bogdan-mihai-brasov-20240620', 
    nume: 'Simion Bogdan-Mihai și Lăutarii de Mătase',
    data: '2025-06-20T19:00:00', 
    grup: 'Muzică', 
    descriere: 'Turneul se bucura de o muzicalitate noua !!! Lăutarul-culegător de muzici de tradiție si unul dintre ultimii cântăreți la cobză din România, Simion Bogdan-Mihai, alături de taraful său, Lăutarii de Mătase, pornesc într-un nou turneu, aducand in trupa si un trompetist renumit! Născut în 1990 la Râmnicu-Vâlcea, Bogdan a început să studieze cobza la doar 15 ani, dedicându-și viața culegerii și interpretării muzicii lăutărești autentice. Începând cu anul 2006, a călătorit prin România, descoperind cântece uitate și învățând de la ultimii cobzari ai tradiției.', 
    locatie: 'Centrul Cultural Reduta, Sala Mare, Brașov',
    imageUrl: '/images/events/simion-bogdan-mihai-brasov.png', 
    pretBilet: " de la 103.31 lei" 
  },
    {
    id: 'romeo-julieta-brasov-20240618', 
    nume: 'Frumoasa si Bestia',
    data: '2025-06-18T19:30:00', 
    grup: 'Teatru', 
    descriere: 'Musicalul “FRUMOASA ȘI BESTIA” revine, dupa zecile de reprezentații avute pe marile scene Broadway, West End, Grand Via....., la Sala Reduta din Brașov pe 14 Octombrie 2025 de la ora 18,30.Theater du Soleil Entertainment vă răsfaţă cu o nouă producţie dinamică, plină de culoare şi emoţie. „Frumoasa şi Bestia” redă cu măiestrie una dintre cele mai îndrăgite poveşti ale copilăriei, într-un MUSICALLIVE, în care personajele prind viaţă, care îi va transporta pe spectatori pe un tărâm de basm. După reprezentațiile de succes de până acum, avute pe marile scene, spectacolul revine la Brașov, cu o adevărată surpriză.',
    locatie: 'Sala Sporturilor "Dumitru Popescu Colibași", Brașov',
    imageUrl: '/images/events/romeo-si-julieta-brasov.png',
    pretBilet: " de la 99 lei" 
  },
    {
    id: 'trooper-30-brasov-20241115', 
    nume: 'TROOPER - 30 (Concert Aniversar)',
    data: '2025-11-15T20:00:00', 
    
    grup: 'Muzică', 
    descriere: 'Trooper va marca 28 de ani de activitate printr-un turneu major ce va ajunge în nu mai puțin de 28 de orașe. Trooper a lansat 10 albume de studio, a cântat pentru mai mult de 900.000 de oameni, în peste 950 de concerte, şi a urcat pe scenă alături de Iron Maiden, Scorpions, Deep Purple, Judas Priest, Whitesnake, Europe, Manowar, Nazareth, WASP, Sepultura, Prodigy etc. ]',
    locatie: 'Kruhnen Musik Halle, Brașov',
    imageUrl: '/images/events/trooper-30-aniversar-brasov.jpg', 
    pretBilet: " de la 50 lei" 
  },
    {
    id: 'sotiile-noastre-brasov-20240612', 
    nume: 'SOȚIILE NOASTRE',
    data: '2025-06-12T19:00:00', 
    grup: 'Teatru', 
    descriere: 'Cosmin Seleși, Răzvan Oprea și Lucian Ghimiși ți-au pregătit o comedie învăluită într-o notă de mister care cu siguranță te va ține în suspans până la finalul spectacoluluiTrei prieteni, Paul, Max și Silviu au întâlnire într-o seară pentru o partidă lungă de cărți.Dar ceea ce pare a fi o întâlnire obișnuită se transformă într-o comedie spumoasă în care conversațiile lor dinamice dezvăluie personaje complexe cu povesti de viață surprinzătoare.Dar oare ce se ascunde în spatele carților și discuțiilor pline de umor?Rămâne să descoperi singur la un spectacol pe care nu vrei să îl ratezi.',
    locatie: 'Centrul Cultural Reduta, Sala Mare, Brașov',
    imageUrl: '/images/events/sotiile-noastre-brasov.png', 
    pretBilet: " de la 133.64 lei" 
  },

  {
    id: 'alifantis-zan-brasov-20241025',
    nume: 'Alifantis & ZAN - Concert Simfonic Mozaic',
    data: '2025-10-25T19:30:00',
    grup: 'Muzică',
    descriere: 'Pentru a sărbători 30 de ani de activitate alături de Zan, Nicu Alifantis anunță cu entuziasm un turneu special, care va aduce împreună publicul din România și Republica Moldova. Nicu Alifantis, în vârstă de 70 de ani, este unul dintre cei mai apreciați artiști de muzică folk . Actor, poet, cântăreţ şi compozitor de muzică folk şi de teatru. Iubit de public, în fiecare dintre ipostaze.',
    locatie: 'Sala Patria, Brașov',
    imageUrl: '/images/events/alifantis-zan-brasov.jpg',
    pretBilet: " de la 119 lei"
  },
  {
    id: 'regatul-de-gheata-brasov-20240603', 
    nume: 'Regatul de Gheață - Lumea Poveștilor',
    data: '2025-06-03T18:00:00', 
    grup: 'Teatru', 
    descriere: 'Spectacolul “FROZEN, REGATUL ÎNGHEȚAT” vine la Sala Reduta din Brasov pe 16 Noiembrie 2025 de la ora 18:00. Theater du Soleil Entertainment și echipa musicalului “Frozen Regatul Înghețat”, vă invită să luați parte la un spectacol magic, cu personaje îndrăgite și cunoscute, atât de cei mici cât și de cei mari. După reprezentațiile de succes de până acum, spectacolul vine în premieră la Cluj Napoca, cu o adevărată surpriza.Este un show grandios o adaptare de Zully Mustafa, un musical în limba română, cu dansuri și momente de balet unice, costume și decoruri de basm, care îi vor purta pe cei mici și mari într-o lume de vis alături de cele mai îndrăgite personaje: Prințesa Anna, Regina Elsa, Hans, Kristoff , Olaf și multe altele.',
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/regatul-de-gheata-brasov.jpg', 
    pretBilet: " de la 62.71 lei" 
  },
   {
    id: 'bosquito-brasov-20240607', 
    nume: 'Bosquito - Un concert de suflet',
    data: '2025-06-07T20:00:00', 
    grup: 'Muzică', 
 descriere: "Pregătește-te pentru o seară memorabilă alături de Bosquito, una dintre cele mai iubite și originale trupe din România! Cunoscuți pentru fuziunea lor unică de ritmuri latino, balcanice, rock și pop, Radu Almășan și colegii săi promit un 'concert de suflet' la Kruhnen Musik Halle. Vei avea ocazia să asculți live atât hiturile consacrate care au marcat generații, cât și piese mai noi, toate interpretate cu pasiunea și energia caracteristică Bosquito. Nu rata ocazia de a te lăsa purtat de acorduri vibrante și versuri pline de emoție într-o atmosferă electrizantă și intimă în același timp!", 
    imageUrl: '/images/events/bosquito-concert-brasov.jpg', 
    pretBilet: " de la 82.71 lei" 
  },
    {
    id: 'directia5-dragobete-brasov-20240224', 
    nume: 'Direcția 5 - Cel mai frumos cadou (Concert de Dragobete)',
    data: '2025-02-24T19:00:00', 
    grup: 'Muzică', 
    descriere: 'În anul 2025 pornim turneul nostru național “Seducție”. Pregătiți-vă să ascultați cântece de pe albumele noastre “La vulturul de mare cu peștele în ghiare”, “Pantofi de lac”, “Seducție” , "In Di Anka Live". Garantat o să vă placă. Vom readuce în atenția voastră cântece din anii 1991-1994, cele mai heavy + baladele noastre rock, încă în sufletele voastre! ',
    locatie: 'Centrul Cultural Reduta, Brașov',
    imageUrl: '/images/events/directia5-dragobete-brasov.png', 
    pretBilet: " de la 163.77 lei" 
  },
];


const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents); 
  const [addedEventIds, setAddedEventIds] = useState(new Set()); 
  const [isLoadingAddedEvents, setIsLoadingAddedEvents] = useState(false); 
  
  const { token, currentUser } = useAuth(); 


  const fetchUserSavedEvents = useCallback(async () => {
    if (token && currentUser) { 
      setIsLoadingAddedEvents(true);
      console.log('EventContext: Se încarcă evenimentele salvate pentru utilizator...');
      try {
        
        const savedIdsArray = await authService.getUserSavedEvents(); 
        setAddedEventIds(new Set(savedIdsArray || []));
        console.log('EventContext: Evenimente salvate încărcate:', savedIdsArray);
      } catch (error) {
        console.error("EventContext: Nu s-au putut încărca evenimentele salvate:", error);
        setAddedEventIds(new Set()); 
      } finally {
        setIsLoadingAddedEvents(false);
      }
    } else {
      
      setAddedEventIds(new Set());
      setIsLoadingAddedEvents(false); 
    }
  }, [token, currentUser]); 

  
  useEffect(() => {
    fetchUserSavedEvents();
  }, [fetchUserSavedEvents]);

  const addEventToCalendar = async (eventId) => {
    if (!token) {
      alert("Te rugăm să te loghezi pentru a salva evenimente în calendarul tău.");
      
      return;
    }
    
    try {


      const updatedSavedEvents = await authService.addEventToUserCalendar(eventId); 
      setAddedEventIds(new Set(updatedSavedEvents)); 
    } catch (error) {
      console.error("EventContext: Eroare la adăugarea evenimentului:", error);
      
      alert("Nu s-a putut adăuga evenimentul. Te rugăm să încerci din nou.");
    }
  };

  const removeEventFromCalendar = async (eventId) => {
    if (!token) return; 

    try {
      

      const updatedSavedEvents = await authService.removeEventFromUserCalendar(eventId); 
      setAddedEventIds(new Set(updatedSavedEvents)); 
    } catch (error) {
      console.error("EventContext: Eroare la ștergerea evenimentului:", error);
      
      alert("Nu s-a putut șterge evenimentul. Te rugăm să încerci din nou.");
    }
  };

  const isEventAdded = (eventId) => {
    return addedEventIds.has(eventId);
  };

  
  const value = {
    events, 
    setEvents, 
    addedEventIds,
    addEventToCalendar,
    removeEventFromCalendar,
    isEventAdded,
    isLoadingAddedEvents 
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};


export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents trebuie folosit în interiorul unui EventProvider');
  }
  return context;
};
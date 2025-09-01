import React, { useState, useCallback } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import './Calendario.css'; 

// Configurar el localizador de dayjs
const localizer = dayjsLocalizer(dayjs);

function CalendarioPage() {
  // Estado para controlar la fecha actual que se muestra
  const [date, setDate] = useState(new Date());

  // Estado para controlar la vista (mes, semana, día)
  const [view, setView] = useState(Views.MONTH);

  // Eventos
  const events = [
    {
      title: 'Evento de prueba',
      // DATO: Los meses en el objeto Date de JS van de 0 (Enero) a 11 (Diciembre).
      // Septiembre es el mes 8.
      start: new Date(2025, 8, 1, 10, 0, 0), // 1 de Septiembre de 2025 a las 10:00
      end: new Date(2025, 8, 1, 11, 30, 0),   // 1 de Septiembre de 2025 a las 11:30
    },
  ];

  // Función para manejar el cambio de fecha (ej: al hacer clic en las flechas)
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

  // Función para manejar el cambio de vista (ej: al hacer clic en "semana")
  const onView = useCallback((newView) => setView(newView), [setView]);

  return (
    <div className="calendario-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={onNavigate}
        view={view}
        onView={onView}
        views={['month', 'week', 'day', 'agenda']} // Vistas disponibles
        defaultView={Views.MONTH}
        showMultiDayTimes // Muestra la hora en eventos de varios días
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}

export default CalendarioPage;
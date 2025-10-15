import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { useUser } from '../context/UserContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// Configurar el localizador de dayjs
const localizer = dayjsLocalizer(dayjs);

// Componente personalizado para eventos con Tippy
function CustomEvent({ event }) {
  const tooltipContent = (
    <div className="event-tooltip-content">
      <div className="tooltip-title">{event.title}</div>
      {event.temas && (
        <div className="tooltip-section">
          <strong>Temas:</strong>
          <span>{event.temas}</span>
        </div>
      )}
      {event.docente && (
        <div className="tooltip-section">
          <strong>Docente:</strong>
          <span>{event.docente.nombre} {event.docente.apellido}</span>
        </div>
      )}
    </div>
  );

  return (
    <Tippy 
      content={tooltipContent}
      arrow={true}
      theme="custom-green"
      placement="auto"
      interactive={true}
      delay={[200, 0]}
      maxWidth="none"
    >
      <div className="event-label">
        {event.title}
      </div>
    </Tippy>
  );
}

function CalendarioPage() {
  // Estado para controlar la fecha actual que se muestra
  const [date, setDate] = useState(new Date());
  const { dni } = useUser();
  // Estado para controlar la vista (mes, semana, día)
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);

  // Función para manejar el cambio de fecha (ej: al hacer clic en las flechas)
  const onNavigate = useCallback((newDate) => setDate(newDate), []);

  // Función para manejar el cambio de vista (ej: al hacer clic en "semana")
  const onView = useCallback((newView) => setView(newView), []);

  useEffect(() => {
    async function fetchEventos() {
      if (!dni) {
        console.log('DNI no disponible, no se pueden cargar eventos.');
        return;
      }

      try {
        const userRes = await fetch(`/api/personas/${dni}`);
        const userData = await userRes.json();
        const userType = userData.data?.tipo; // Suponiendo que el tipo de usuario viene en "tipo"

        if (!userType) {
          console.log('No se pudo determinar el tipo de usuario.');
          return;
        }

        if (userType === 'alumno') {
          const alumnoRes = await fetch(`/api/personas/${dni}`);
          const alumnoData = await alumnoRes.json();
          const cursoId = alumnoData.data?.cursoId;
          if (!cursoId) {
            console.log('El alumno no está asociado a ningún curso.');
            return;
          }

          const dictadosRes = await fetch(`/api/dictados?cursoId=${cursoId}`);
          const dictadosData = await dictadosRes.json();
          const dictados = Array.isArray(dictadosData) ? dictadosData : [];

          const todosExamenes = dictados.flatMap((dictado) =>
            (dictado.examenes || []).map((examen) => ({
              ...examen,
              materia: dictado.materia,
              docente: dictado.docente,
            }))
          );

          const events = todosExamenes.map((examen) => ({
            title: `${examen.materia?.nombre || 'Materia'} - Examen`,
            start: new Date(examen.fecha_examen),
            end: new Date(examen.fecha_examen),
            examenId: examen.id,
            temas: examen.temas,
            docente: examen.docente,
          }));

          setEvents(events);
        } else if (userType === 'docente') {
          const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
          const dictadosData = await dictadosRes.json();
          const dictados = Array.isArray(dictadosData) ? dictadosData : [];

          const todosExamenes = dictados.flatMap((dictado) =>
            (dictado.examenes || []).map((examen) => ({
              ...examen,
              materia: dictado.materia,
            }))
          );

          const events = todosExamenes.map((examen) => ({
            title: `${examen.materia?.nombre || 'Materia'} - Examen`,
            start: new Date(examen.fecha_examen),
            end: new Date(examen.fecha_examen),
            examenId: examen.id,
            temas: examen.temas,
          }));

          setEvents(events);
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    }

    fetchEventos();
  }, [dni]);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      components={{
        event: CustomEvent,
      }}
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
  );
}

export default CalendarioPage;
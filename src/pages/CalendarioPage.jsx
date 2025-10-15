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
        // Obtener información del usuario
        const userRes = await fetch(`/api/personas/${dni}`);
        const userData = await userRes.json();
        const userType = userData.data?.tipo;
        const cursoId = userData.data?.cursoId;

        console.log('Usuario:', { tipo: userType, dni, cursoId });

        if (!userType) {
          console.log('No se pudo determinar el tipo de usuario.');
          return;
        }

        if (userType === 'alumno') {
          // Verificar que el alumno tenga un curso asignado
          if (!cursoId) {
            console.log('El alumno no está asociado a ningún curso.');
            setEvents([]);
            return;
          }

          console.log('Obteniendo dictados para el curso:', cursoId);

          // Obtener SOLO los dictados del curso del alumno
          const dictadosRes = await fetch(`/api/dictados?cursoId=${cursoId}`);
          const dictadosData = await dictadosRes.json();
          const dictados = Array.isArray(dictadosData) ? dictadosData : [];

          console.log('Dictados recibidos:', dictados.length);

          // Filtrar dictados por cursoId (doble verificación)
          const dictadosDelCurso = dictados.filter(
            (dictado) => dictado.cursoId === cursoId
          );

          console.log('Dictados filtrados del curso del alumno:', dictadosDelCurso.length);

          // Extraer todos los exámenes de los dictados del curso
          const todosExamenes = dictadosDelCurso.flatMap((dictado) =>
            (dictado.examenes || []).map((examen) => ({
              ...examen,
              materia: dictado.materia,
              docente: dictado.docente,
              cursoId: dictado.cursoId, // Mantener referencia al curso
            }))
          );

          console.log('Exámenes extraídos:', todosExamenes.length);

          // Mapear exámenes a eventos del calendario
          const eventos = todosExamenes.map((examen) => ({
            title: `${examen.materia?.nombre || 'Materia'} - Examen`,
            start: new Date(examen.fecha_examen),
            end: new Date(examen.fecha_examen),
            examenId: examen.id,
            temas: examen.temas,
            docente: examen.docente,
            materia: examen.materia,
            cursoId: examen.cursoId,
          }));

          console.log('Eventos del calendario creados:', eventos);
          setEvents(eventos);

        } else if (userType === 'docente') {
          console.log('Obteniendo dictados para el docente:', dni);

          // Obtener dictados del docente
          const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
          const dictadosData = await dictadosRes.json();
          const dictados = Array.isArray(dictadosData) ? dictadosData : [];

          console.log('Dictados del docente recibidos:', dictados.length);

          // Extraer todos los exámenes de los dictados del docente
          const todosExamenes = dictados.flatMap((dictado) =>
            (dictado.examenes || []).map((examen) => ({
              ...examen,
              materia: dictado.materia,
              curso: dictado.curso,
            }))
          );

          console.log('Exámenes del docente extraídos:', todosExamenes.length);

          // Mapear exámenes a eventos del calendario
          const eventos = todosExamenes.map((examen) => ({
            title: `${examen.materia?.nombre || 'Materia'} - Examen`,
            start: new Date(examen.fecha_examen),
            end: new Date(examen.fecha_examen),
            examenId: examen.id,
            temas: examen.temas,
            materia: examen.materia,
            curso: examen.curso,
          }));

          console.log('Eventos del calendario del docente creados:', eventos);
          setEvents(eventos);
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        setEvents([]);
      }
    }

    fetchEventos();
  }, [dni]);

  return (
    <div className="calendario">
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
        views={['month', 'week', 'day', 'agenda']}
        defaultView={Views.MONTH}
        showMultiDayTimes
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}

export default CalendarioPage;
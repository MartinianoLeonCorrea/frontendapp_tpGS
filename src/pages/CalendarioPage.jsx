import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { useUser } from '../context/UserContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <span>
            {event.docente.nombre} {event.docente.apellido}
          </span>
        </div>
      )}
      {event.curso && (
        <div className="tooltip-section">
          <strong>Curso:</strong>
          <span>
            {event.curso.nro_letra} - {event.curso.turno}
          </span>
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
      <div className="event-label">{event.title}</div>
    </Tippy>
  );
}

function CalendarioPage() {
  const { dni } = useUser();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const onNavigate = useCallback((newDate) => setDate(newDate), []);
  const onView = useCallback((newView) => setView(newView), []);

  useEffect(() => {
    fetchEventos();
  }, [dni]);

  const fetchEventos = async () => {
    if (!dni) {
      console.log('DNI no disponible, no se pueden cargar eventos.');
      toast.info('Esperando datos del usuario...');
      setLoading(false);
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Cargando exámenes...');

    try {
      // Obtener información del usuario
      const userRes = await fetch(`/api/personas/${dni}`);
      
      if (!userRes.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      const userData = await userRes.json();
      const userType = userData.data?.tipo;
      const cursoId = userData.data?.cursoId;

      console.log('Usuario:', { tipo: userType, dni, cursoId });

      if (!userType) {
        throw new Error('No se pudo determinar el tipo de usuario');
      }

      let eventos = [];

      if (userType === 'alumno') {
        if (!cursoId) {
          toast.update(toastId, {
            render: 'ℹ️ No estás asociado a ningún curso',
            type: 'info',
            isLoading: false,
            autoClose: 3000,
          });
          setEvents([]);
          setLoading(false);
          return;
        }

        console.log('Obteniendo dictados para el curso:', cursoId);

        // Obtener dictados del curso del alumno
        const dictadosRes = await fetch(`/api/dictados?cursoId=${cursoId}`);
        
        if (!dictadosRes.ok) {
          throw new Error('Error al obtener los dictados');
        }

        const dictadosData = await dictadosRes.json();
        const dictados = Array.isArray(dictadosData) ? dictadosData : [];

        console.log('Dictados recibidos:', dictados.length);

        // Filtrar dictados por cursoId (doble verificación)
        const dictadosDelCurso = dictados.filter(
          (dictado) => dictado.cursoId === cursoId
        );

        console.log(
          'Dictados filtrados del curso del alumno:',
          dictadosDelCurso.length
        );

        // Extraer todos los exámenes de los dictados del curso
        const todosExamenes = dictadosDelCurso.flatMap((dictado) =>
          (dictado.examenes || []).map((examen) => ({
            ...examen,
            materia: dictado.materia,
            docente: dictado.docente,
            cursoId: dictado.cursoId,
          }))
        );

        console.log('Exámenes extraídos:', todosExamenes.length);

        // Mapear exámenes a eventos del calendario
        eventos = todosExamenes.map((examen) => ({
          title: `${examen.materia?.nombre || 'Materia'} - Examen`,
          start: new Date(examen.fecha_examen),
          end: new Date(examen.fecha_examen),
          examenId: examen.id,
          temas: examen.temas,
          docente: examen.docente,
          materia: examen.materia,
          cursoId: examen.cursoId,
        }));

        toast.update(toastId, {
          render: `✅ ${eventos.length} exámenes cargados`,
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });

      } else if (userType === 'docente') {
        console.log('Obteniendo dictados para el docente:', dni);

        // Obtener dictados del docente
        const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
        
        if (!dictadosRes.ok) {
          throw new Error('Error al obtener los dictados del docente');
        }

        const dictadosData = await dictadosRes.json();
        const dictados = Array.isArray(dictadosData) ? dictadosData : [];

        console.log('Dictados del docente recibidos:', dictados.length);

        // Extraer todos los exámenes de los dictados del docente
        const todosExamenes = dictados.flatMap((dictado) =>
          (dictado.examenes || []).map((examen) => ({
            ...examen,
            materia: dictado.materia,
            curso: dictado.curso,
            docente: dictado.docente,
          }))
        );

        console.log('Exámenes del docente extraídos:', todosExamenes.length);

        // Mapear exámenes a eventos del calendario
        eventos = todosExamenes.map((examen) => ({
          title: `${examen.materia?.nombre || 'Materia'} - Examen`,
          start: new Date(examen.fecha_examen),
          end: new Date(examen.fecha_examen),
          examenId: examen.id,
          temas: examen.temas,
          materia: examen.materia,
          curso: examen.curso,
          docente: examen.docente,
        }));

        toast.update(toastId, {
          render: `✅ ${eventos.length} exámenes cargados`,
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
      }

      console.log('Eventos del calendario creados:', eventos);
      setEvents(eventos);

    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      toast.update(toastId, {
        render: `❌ ${error.message || 'Error al cargar los exámenes'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="calendario">
        <ToastContainer position="top-right" autoClose={3000} />
        <p>Cargando calendario...</p>
      </div>
    );
  }

  return (
    <div className="calendario">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {events.length === 0 && !loading && (
        <div className="calendario-empty-message">
          <p>📅 No hay exámenes programados</p>
        </div>
      )}

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
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay exámenes en este rango de fechas',
        }}
      />
    </div>
  );
}

export default CalendarioPage;
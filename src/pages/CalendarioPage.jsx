import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';

function CalendarioPage() {
  const localizer = dayjsLocalizer(dayjs);
  const events = [
    {
      start: new Date(2025, 8, 13), // 13 de agosto de 2025
      end: new Date(2025, 8, 13, 1), // 1 hora más tarde
      title: 'Evento de prueba',
    },
  ];
  return (
    <div className="calendario">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default CalendarioPage;

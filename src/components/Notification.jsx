import { useEffect, useRef } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

export default function Notification({ message, type, duration = 2500 }) {
  const ref = useRef();

  useEffect(() => {
    if (message) {
      const backgroundColor =
        type === 'success'
          ? '#4CAF50'
          : type === 'error'
            ? '#f44336'
            : '#2196F3';

      const tooltip = tippy(document.body, {
        content: message,
        trigger: 'manual',
        placement: 'top',
        theme: 'light-border',
        allowHTML: true,
        onShow: (instance) => {
          instance.popper.querySelector('.tippy-box').style.backgroundColor =
            backgroundColor;
          instance.popper.querySelector('.tippy-box').style.color = '#fff';
          instance.popper.querySelector('.tippy-box').style.fontWeight = 'bold';
        },
      });

      tooltip.show();

      const timeout = setTimeout(() => {
        tooltip.destroy();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [message, type, duration]);

  return <div ref={ref}></div>;
}

import { useEffect, useState } from 'react';

export const useTypingText = (fullText: string, speed = 70) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index += 1;
      if (index >= fullText.length) {
        window.clearInterval(timer);
      }
    }, speed);

    const cursorTimer = window.setInterval(() => setShowCursor((value) => !value), 500);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(cursorTimer);
    };
  }, [fullText, speed]);

  return { text, showCursor };
};

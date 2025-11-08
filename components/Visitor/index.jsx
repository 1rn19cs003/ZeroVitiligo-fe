"use client";
import { useEffect, useState } from 'react';

export default function Visitor() {
  const [visitorCount, setVisitorCount] = useState(0);
  const URL = process.env.NEXT_PUBLIC_SERVER_URL_WEB_SOCKET
  useEffect(() => {
    const socket = new WebSocket(URL);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.visitorCount !== undefined) {
        setVisitorCount(data.visitorCount);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h4>Visitors: {visitorCount}</h4>
    </div>
  );
}

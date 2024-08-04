import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const getOrCreateClientId = () => {
  if (typeof window !== "undefined") {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem("clientId", clientId);
    }
    return clientId;
  }
  return null;
};

const useSocket = (url, options) => {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(getOrCreateClientId());
  }, []);

  const socketRef = useRef(null);

  useEffect(() => {
    if (clientId) {
      socketRef.current = io(url, {
        ...options,
        query: { clientId },
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [clientId, url, options]);

  return socketRef.current;
};

export default useSocket;

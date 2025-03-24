"use client";
import { createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export const SessionContext = createContext(null);

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

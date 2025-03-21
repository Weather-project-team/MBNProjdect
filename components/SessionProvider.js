"use client";
import { createContext } from "react";

// ✅ 세션을 저장할 Context 생성
export const SessionContext = createContext(null);

export default function SessionProvider({ session, children }) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

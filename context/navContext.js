"use client"; // Required for context in App Router

import { createContext, useContext, useState } from "react";

const NavContext = createContext();

export function NavProvider({ children }) {
  const [min, setMin] = useState(false);

  const minimize = () => setMin(true);
  const maximize = () => setMin(false);
  const toggle = () => setMin(!min)

  return (
    <NavContext.Provider value={{ min, minimize, maximize, toggle }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}

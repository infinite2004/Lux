import React, { createContext, useContext, useState } from "react";

interface SheetContextValue {
  showDevices: boolean;
  setShowDevices: (v: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [showDevices, setShowDevices] = useState(false);
  return (
    <SheetContext.Provider value={{ showDevices, setShowDevices }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used within SheetProvider");
  return ctx;
}

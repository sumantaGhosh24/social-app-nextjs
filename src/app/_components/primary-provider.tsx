"use client";

import {createContext, useState, useEffect, useContext, ReactNode} from "react";

interface PrimaryColorContextType {
  primaryColor: string;
  setPrimaryColor: (primaryColor: string) => void;
}

const initialState: PrimaryColorContextType = {
  primaryColor: "blue",
  setPrimaryColor: () => null,
};

const PrimaryColorProviderContext =
  createContext<PrimaryColorContextType>(initialState);

interface PrimaryColorProviderProps {
  children: ReactNode;
}

export default function PrimaryColorProvider({
  children,
}: PrimaryColorProviderProps) {
  const [primaryColor, setPrimaryColor] = useState<string>();

  useEffect(() => {
    const pColor = localStorage.getItem("primaryColor") || "blue";
    setPrimaryColor(pColor);
  }, []);

  const value = {
    primaryColor,
    setPrimaryColor: (primaryColor: string) => {
      localStorage.setItem("primaryColor", primaryColor);
      setPrimaryColor(primaryColor);
    },
  };

  return (
    <PrimaryColorProviderContext.Provider value={value as any}>
      {children}
    </PrimaryColorProviderContext.Provider>
  );
}

export const usePrimaryColor = (): PrimaryColorContextType => {
  const context = useContext(PrimaryColorProviderContext);

  if (context === undefined)
    throw new Error(
      "usePrimaryColor must be used within a PrimaryColorProvider"
    );

  return context;
};

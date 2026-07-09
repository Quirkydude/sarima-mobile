import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COMMODITIES, MARKETS } from "../constants/data";

type Period = "1w" | "2w";

type SelectionContextType = {
  commodityId: string;
  marketId: string;
  period: Period;
  setCommodityId: (id: string) => void;
  setMarketId: (id: string) => void;
  setPeriod: (p: Period) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const STORAGE_KEY = "gapip_selection";

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [commodityId, setCommodityId] = useState(COMMODITIES[0].id);
  const [marketId, setMarketId] = useState(MARKETS[0].id);
  const [period, setPeriod] = useState<Period>("1w");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.commodityId) setCommodityId(saved.commodityId);
          if (saved.marketId) setMarketId(saved.marketId);
          if (saved.period) setPeriod(saved.period);
        }
      } catch {
        // ignore — defaults are fine
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ commodityId, marketId, period })).catch(() => {});
  }, [commodityId, marketId, period]);

  return (
    <SelectionContext.Provider value={{ commodityId, marketId, period, setCommodityId, setMarketId, setPeriod }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}

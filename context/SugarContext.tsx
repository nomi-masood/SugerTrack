import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, SugarRecord, Unit } from '../types';

const SugarContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = 'sugar_track_pro_db';
const THEME_KEY = 'sugar_track_theme';
const UNIT_KEY = 'sugar_track_default_unit';

export const SugarProvider = ({ children }: { children?: ReactNode }) => {
  const [records, setRecords] = useState<SugarRecord[]>([]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const [defaultUnit, setDefaultUnitState] = useState<Unit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(UNIT_KEY) as Unit) || 'mg/dL';
    }
    return 'mg/dL';
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to local storage whenever records change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  // Handle Theme Changes
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setDefaultUnit = (unit: Unit) => {
    setDefaultUnitState(unit);
    localStorage.setItem(UNIT_KEY, unit);
  };

  const addRecord = (newRecord: Omit<SugarRecord, 'id'>) => {
    const record: SugarRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
    };
    setRecords(prev => [record, ...prev]);
  };

  const updateRecord = (updatedRecord: SugarRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const deleteRecords = (ids: string[]) => {
    setRecords(prev => prev.filter(r => !ids.includes(r.id)));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sugartrack_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        // Basic validation
        const isValid = parsed.every(r => r.timestamp && r.value && r.unit && r.category);
        if (isValid) {
          setRecords(parsed);
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <SugarContext.Provider value={{ 
      records, 
      addRecord, 
      updateRecord,
      deleteRecord, 
      deleteRecords,
      exportData, 
      importData, 
      theme, 
      toggleTheme,
      defaultUnit,
      setDefaultUnit
    }}>
      {children}
    </SugarContext.Provider>
  );
};

export const useSugar = () => {
  const context = useContext(SugarContext);
  if (!context) throw new Error("useSugar must be used within SugarProvider");
  return context;
};
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const activeRequestRef = useRef(null);

  const fetchItems = useCallback(async ({ page = 1, limit = 10, q = '' } = {}) => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }
    const controller = new AbortController();
    activeRequestRef.current = controller;

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (q) params.set('q', q);

    try {
      const res = await fetch(`http://localhost:4001/api/items?${params.toString()}` , { signal: controller.signal });
      const json = await res.json();
      setItems(json.items || []);
      setMeta(json.meta || { total: 0, page: 1, limit, totalPages: 1 });
      return json;
    } catch (err) {
      if (err.name !== 'AbortError') throw err;
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, meta, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
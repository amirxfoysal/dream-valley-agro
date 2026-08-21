import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchPublicJson } from '../api/client.js';
import {
  DEFAULT_SUBCATEGORIES,
  setSubcategories,
} from '../constants/categories.js';

const SubcategoriesContext = createContext({
  subcategories: DEFAULT_SUBCATEGORIES,
  reload: async () => {},
});

const mapSubcategories = (list) =>
  [...list]
    .map((s) => ({
      slug: s.slug,
      en: s.name,
      bn: s.nameBn || s.name,
      parent: s.parent,
      image: s.image || '',
      sortOrder: s.sortOrder || 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

export function SubcategoriesProvider({ children }) {
  const [subcategories, setSubs] = useState(DEFAULT_SUBCATEGORIES);

  const reload = useCallback(async () => {
    try {
      const list = await fetchPublicJson('/subcategories');
      if (!Array.isArray(list) || list.length === 0) return;
      const mapped = mapSubcategories(list);
      setSubcategories(mapped);
      setSubs(mapped);
    } catch {
      // keep defaults when API is unreachable
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SubcategoriesContext.Provider value={{ subcategories, reload }}>
      {children}
    </SubcategoriesContext.Provider>
  );
}

export const useSubcategories = () => useContext(SubcategoriesContext);

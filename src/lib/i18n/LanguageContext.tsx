"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Lang, type Translations } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: translations.en,
  toggle: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "en" ? "am" : "en")),
    []
  );

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook to consume translations anywhere in the app */
export function useLanguage() {
  return useContext(LanguageContext);
}

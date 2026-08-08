import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const HomepageContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useHomepage = () =>
  useContext(HomepageContext) ?? {
    data: null,
    error: null,
    loading: false,
    refetch: () => {},
  };

let inflight = null;

const loadHomepage = () => {
  if (!inflight) {
    inflight = api
      .get("/cms/public/homepage")
      .then(({ data }) => data.data)
      .catch((error) => {
        inflight = null;
        throw error;
      });
  }
  return inflight;
};

export function HomepageProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    loadHomepage().then(
      (result) => {
        if (!active) return;
        setData(result);
        setError(null);
      },
      (requestError) => {
        if (!active) return;
        setError(requestError);
      },
    );
    return () => {
      active = false;
    };
  }, [version]);

  const refetch = useCallback(() => {
    inflight = null;
    setData(null);
    setError(null);
    setVersion((value) => value + 1);
  }, []);

  return (
    <HomepageContext.Provider
      value={{ data, error, loading: !data && !error, refetch }}
    >
      {children}
    </HomepageContext.Provider>
  );
}

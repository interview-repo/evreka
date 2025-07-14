import { useCallback } from "react";

export function useUrlState() {
  const setUrlParam = useCallback(
    (key: string, value: string | number | boolean) => {
      const url = new URL(window.location.href);
      url.searchParams.set(key, String(value));
      window.history.pushState({}, "", url.toString());
    },
    []
  );

  const removeUrlParam = useCallback((key: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.pushState({}, "", url.toString());
  }, []);

  const getUrlParam = useCallback((key: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }, []);

  const getUrlParamAsNumber = useCallback(
    (key: string): number | null => {
      const value = getUrlParam(key);
      return value ? Number(value) : null;
    },
    [getUrlParam]
  );

  const getUrlParamAsBoolean = useCallback(
    (key: string): boolean | null => {
      const value = getUrlParam(key);
      return value === "true" ? true : value === "false" ? false : null;
    },
    [getUrlParam]
  );

  return {
    setUrlParam,
    removeUrlParam,
    getUrlParam,
    getUrlParamAsNumber,
    getUrlParamAsBoolean,
  };
}

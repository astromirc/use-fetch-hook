import { useState, useEffect, useCallback, useRef } from "react";

interface FetchResponse<T> {
  data: T | null;
  error: any;
  status: number;
}

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const request = useCallback(
    async <T = any>(endpoint: string, options: RequestInit = {}): Promise<FetchResponse<T>> => {
      setIsLoading(true);

      // Crear un nuevo AbortController para esta petición
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        // Headers: Si es FormData, el navegador maneja el Content-Type
        options.headers =
          options.body instanceof FormData
            ? options.headers
            : { ...options.headers, "Content-Type": "application/json" };

        // Body: Convierte a JSON si es objeto, sino lo deja igual
        options.body = options.body && options.body instanceof FormData ? options.body : JSON.stringify(options.body);

        // Signal AbortController
        options.signal = abortController.signal;

        const response = await fetch(endpoint, options);
        const data = await response.json();

        return response.ok
          ? { data, error: null, status: response.status }
          : { data: null, error: data, status: response.status };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return { data: null, error: errorMessage, status: 500 };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      // Abortar la petición al desmontar el componente
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return { request, isLoading };
};

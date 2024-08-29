import React, { createContext, ReactNode, useContext, useMemo } from "react";
import axios, { AxiosInstance } from "axios";
import { useTokens } from "@/contexts/tokens-context";

const ApiClientContext = createContext<AxiosInstance | undefined>(undefined);

interface ApiClientProviderProps {
  children: ReactNode;
}

export const ApiClientProvider: React.FC<ApiClientProviderProps> = ({
  children,
}) => {
  const { tokens, updateTokens } = useTokens();

  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000/v1",
    });

    instance.interceptors.request.use((config) => {
      if (tokens) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.statusCode == 401) {
          updateTokens(null);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [tokens, updateTokens]);

  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = (): AxiosInstance => {
  const context = useContext(ApiClientContext);

  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }

  return context;
};

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Tokens {
  accessToken: string;
  scope: string;
  tokenType: "Bearer";
  expiryDate: number;
}

interface TokensContextValue {
  tokens: Tokens | null;
  updateTokens: (tokens: Tokens | null) => void;
}

const TokensContext = createContext<TokensContextValue | undefined>(undefined);

export const TokensProvider = ({ children }: PropsWithChildren) => {
  const [tokens, setTokens] = useState<Tokens | null>(null);

  useEffect(() => {
    try {
      // const storedTokens = JSON.parse(localStorage.getItem("tokens") ?? "");
      // if (storedTokens) {
      //   setTokens(storedTokens);
      // }
    } catch {}
  }, []);

  const updateTokens = useMemo(
    () => (newTokens: Tokens | null) => {
      setTokens(newTokens);
      localStorage.setItem("tokens", JSON.stringify(newTokens));
    },
    [setTokens]
  );

  const value = useMemo(() => {
    return { tokens, updateTokens };
  }, [tokens, updateTokens]);

  return (
    <TokensContext.Provider value={value}>{children}</TokensContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokensContext);

  if (!context) {
    throw new Error("useTokens must be used within a TokensProvider");
  }

  return context;
};

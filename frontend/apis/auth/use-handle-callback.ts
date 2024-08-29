import { useApiClient } from "@/contexts/api-client-context";
import { useTokens } from "@/contexts/tokens-context";
import { useEffect } from "react";

export default function useHandleCallback() {
  const apiClient = useApiClient();
  const { updateTokens } = useTokens();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");

    const removeSearchParams = () => {
      window.history.replaceState(
        {},
        document.title,
        new URL(window.location.href).pathname
      );
    };

    if (code) {
      apiClient.get("/auth/google/callback", { params: { code } }).then((r) => {
        updateTokens(r.data);
        removeSearchParams();
      });
    }
  }, [apiClient, updateTokens]);
}

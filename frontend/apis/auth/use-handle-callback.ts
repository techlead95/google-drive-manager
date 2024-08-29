import { useApiClient } from "@/contexts/api-client-context";
import { useTokens } from "@/contexts/tokens-context";
import { useEffect } from "react";

export default function useHandleCallback() {
  const code = new URLSearchParams(location.search).get("code");
  const apiClient = useApiClient();
  const { updateTokens } = useTokens();

  useEffect(() => {
    if (code) {
      apiClient
        .get("/google-drive/callback", { params: { code } })
        .then((r) => {
          updateTokens(r.data);
        });
    }
  }, [code, apiClient, updateTokens]);
}

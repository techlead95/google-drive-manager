import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

export default function useCallback() {
  const code = new URLSearchParams(location.search).get("code");

  return useQuery<string>({
    queryKey: ["access-token", code],
    queryFn: () =>
      apiClient
        .get("/google-drive/callback", {
          params: { code: new URLSearchParams(location.search).get("code") },
        })
        .then((r) => r.data.access_token),
    enabled: !!code,
    refetchOnWindowFocus: false,
  });
}

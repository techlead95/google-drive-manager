import { useApiClient } from "@/contexts/api-client-context";
import { useQuery } from "@tanstack/react-query";

export default function useGetFiles() {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["files"],
    queryFn: () => apiClient.get("/google-drive/files").then((r) => r.data),
  });
}

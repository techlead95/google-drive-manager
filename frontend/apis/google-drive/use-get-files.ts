import { useApiClient } from "@/contexts/api-client-context";
import { useQuery } from "@tanstack/react-query";

interface File {
  id: string;
  modifiedTime: string;
  name: string;
}

export default function useGetFiles() {
  const apiClient = useApiClient();

  return useQuery<File[]>({
    queryKey: ["files"],
    queryFn: () => apiClient.get("/google-drive/files").then((r) => r.data),
  });
}

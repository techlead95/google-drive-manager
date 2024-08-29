import { useApiClient } from "@/contexts/api-client-context";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteFile() {
  const apiClient = useApiClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (fileId) => apiClient.delete(`/google-drive/files/${fileId}`),
  });
}

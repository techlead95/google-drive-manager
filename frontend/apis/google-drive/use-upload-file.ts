import { useApiClient } from "@/contexts/api-client-context";
import { useMutation } from "@tanstack/react-query";

export default function useUploadFile() {
  const apiClient = useApiClient();

  return useMutation<unknown, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      await apiClient.post(`/google-drive/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
}

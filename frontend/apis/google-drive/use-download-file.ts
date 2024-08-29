import { useApiClient } from "@/contexts/api-client-context";
import { useMutation } from "@tanstack/react-query";
import { saveAs } from "file-saver";

const extractFileName = (contentDisposition: string) => {
  const match =
    contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/i);
  return match ? match[1] : "downloaded-file";
};

export default function useDownloadFile() {
  const apiClient = useApiClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (fileId) =>
      apiClient
        .get(`/google-drive/files/${fileId}`, { responseType: "blob" })
        .then((r) => {
          console.log(r.headers);
          saveAs(r.data, extractFileName(r.headers["content-disposition"]));
        }),
  });
}

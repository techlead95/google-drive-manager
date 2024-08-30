import { useApiClient } from "@/contexts/api-client-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface File {
  id: string;
  mimeType: string;
  modifiedTime: string;
  name: string;
}

interface GetFilesResponse {
  files: File[];
  nextPageToken?: string;
}

export default function useGetFiles() {
  const apiClient = useApiClient();

  return useInfiniteQuery<GetFilesResponse, Error>({
    queryKey: ["files"],
    queryFn: ({ pageParam = undefined }) =>
      apiClient
        .get("/google-drive/files", {
          params: {
            pageToken: pageParam,
          },
        })
        .then((r) => r.data),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });
}

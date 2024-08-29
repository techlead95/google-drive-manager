import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useApiClient } from "@/contexts/api-client-context";

export default function useInitiateLogin() {
  const { toast } = useToast();
  const apiClient = useApiClient();

  return useMutation<{ url: string }>({
    mutationFn: () =>
      apiClient.get("/auth/google/authorize").then((r) => r.data),
    onSuccess(response) {
      location.href = response.url;
    },
    onError() {
      toast({
        title: "Error initiating login",
        variant: "destructive",
      });
    },
  });
}

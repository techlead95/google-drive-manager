import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { AxiosResponse } from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function useInitiateLogin() {
  const { toast } = useToast();

  return useMutation<string>({
    mutationFn: () => apiClient.get("/google-drive/auth").then((r) => r.data),
    onSuccess(authUrl) {
      location.href = authUrl;
    },
    onError() {
      toast({
        title: "Error initiating login",
        variant: "destructive",
      });
    },
  });
}

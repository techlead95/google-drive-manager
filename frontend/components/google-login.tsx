"use client";

import useInitiateLogin from "@/apis/google-drive/use-initiate-login";
import { Button } from "./ui/button";
import LoadingSpinner from "./loading-spinner";

export default function GoogleLogin() {
  const initiateLogin = useInitiateLogin();

  return (
    <Button
      disabled={initiateLogin.isPending}
      onClick={() => {
        initiateLogin.mutate();
      }}
      className="w-44"
    >
      {initiateLogin.isPending ? <LoadingSpinner /> : "Sign in with Google"}
    </Button>
  );
}

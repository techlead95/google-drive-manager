"use client";

import { Button } from "./ui/button";
import LoadingSpinner from "./loading-spinner";
import useInitiateLogin from "@/apis/auth/use-initiate-login";

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

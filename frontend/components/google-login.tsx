"use client";

import { Button } from "./ui/button";
import useInitiateLogin from "@/apis/auth/use-initiate-login";

export default function GoogleLogin() {
  const initiateLogin = useInitiateLogin();

  return (
    <Button
      disabled={initiateLogin.isPending}
      onClick={() => {
        initiateLogin.mutate();
      }}
    >
      Sign in with Google
    </Button>
  );
}

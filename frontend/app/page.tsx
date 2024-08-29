"use client";

import useHandleCallback from "@/apis/auth/use-handle-callback";
import FilesList from "@/components/files-list";
import GoogleLogin from "@/components/google-login";
import { useTokens } from "@/contexts/tokens-context";

export default function Home() {
  const { tokens } = useTokens();
  useHandleCallback();

  return (
    <main className="h-screen p-6">
      {!tokens ? (
        <div className="h-full flex justify-center items-center">
          <GoogleLogin />
        </div>
      ) : (
        <FilesList />
      )}
    </main>
  );
}

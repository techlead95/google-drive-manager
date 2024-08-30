"use client";

import useHandleCallback from "@/apis/auth/use-handle-callback";
import FileList from "@/components/file-list";
import FileUpload from "@/components/file-upload";
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
        <div className="flex flex-col gap-4">
          <FileUpload />
          <FileList />
        </div>
      )}
    </main>
  );
}

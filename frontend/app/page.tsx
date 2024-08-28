"use client";

import useAccessToken from "@/apis/google-drive/use-access-token";
import GoogleLogin from "@/components/google-login";

export default function Home() {
  const { data: accessToken } = useAccessToken();

  return (
    <main className="h-screen p-6">
      {!accessToken ? (
        <div className="h-full flex justify-center items-center">
          <GoogleLogin />
        </div>
      ) : (
        <p>Access token: {accessToken}</p>
      )}
    </main>
  );
}

"use client";

import useGetFiles from "@/apis/google-drive/use-get-files";

export default function FilesList() {
  const { data } = useGetFiles();

  console.log(data);

  return (
    <div>
      <p>Files List</p>
    </div>
  );
}

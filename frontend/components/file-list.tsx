"use client";

import useGetFiles from "@/apis/google-drive/use-get-files";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { format } from "date-fns";
import DownloadFileButton from "./download-file-button";
import DeleteFileButton from "./delete-file-button";
import LoadingSpinner from "./loading-spinner";
import { Button } from "./ui/button";

export default function FileList() {
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFiles();

  if (!data) {
    return (
      <div className="flex p-4 justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="w-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.pages.map((page) =>
            page.files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>
                  {format(new Date(file.modifiedTime), "Pp")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <DownloadFileButton fileId={file.id} />
                    <DeleteFileButton
                      fileId={file.id}
                      fileName={file.name}
                      onSuccess={refetch}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center p-4 pb-8">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        </div>
      )}
    </>
  );
}

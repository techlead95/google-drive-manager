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
import { Button } from "./ui/button";
import { Download, Trash } from "lucide-react";
import { format } from "date-fns";
import DownloadFileButton from "./download-file-button";
import DeleteFileButton from "./delete-file-button";

export default function FileList() {
  const { data } = useGetFiles();

  if (!data) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead className="w-0"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((file) => (
          <TableRow key={file.id}>
            <TableCell className="font-medium">{file.name}</TableCell>
            <TableCell>{format(new Date(file.modifiedTime), "Pp")}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <DownloadFileButton fileId={file.id} />
                <DeleteFileButton fileId={file.id} fileName={file.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

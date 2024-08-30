import useUploadFile from "@/apis/google-drive/use-upload-file";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, LoaderIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadIcon from "./upload-icon";

export default function FileUpload() {
  const { mutate, isPending } = useUploadFile();
  const queryClient = useQueryClient();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      mutate(acceptedFiles[0], {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["files"] });
        },
      });
    },
    [mutate, queryClient]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isPending,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex flex-col items-center gap-3 p-4 border-2 border-dashed rounded-md",
          isPending ? "cursor-wait" : "cursor-pointer"
        ),
      })}
    >
      <input {...getInputProps()} />

      {isPending ? (
        <LoaderIcon className="animate-spin w-8 h-8" />
      ) : (
        <UploadIcon />
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {isPending ? (
          <span className="font-semibold">Uploading...</span>
        ) : (
          <>
            <span className="font-semibold">Click to upload</span>
            &nbsp;or drag and drop
          </>
        )}
      </p>
    </div>
  );
}

import useDownloadFile from "@/apis/google-drive/use-download-file";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface Props {
  fileId: string;
}

export default function DownloadFileButton({ fileId }: Props) {
  const downloadFile = useDownloadFile();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => {
        downloadFile.mutate(fileId);
      }}
      disabled={downloadFile.isPending}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";
import useDeleteFile from "@/apis/google-drive/use-delete-file";
import { useToast } from "./ui/use-toast";

interface Props {
  fileId: string;
  fileName: string;
  onSuccess: () => void;
}

export default function DeleteFileButton({
  fileId,
  fileName,
  onSuccess,
}: Props) {
  const deleteFile = useDeleteFile();
  const { toast } = useToast();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="destructive"
          size="icon"
          disabled={deleteFile.isPending}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete File</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to remove {fileName} from Google Drive?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteFile.mutate(fileId, {
                onSuccess() {
                  toast({
                    title: "File Deleted",
                    description: `${fileName} has been removed from Google Drive.`,
                  });

                  onSuccess();
                },
              })
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

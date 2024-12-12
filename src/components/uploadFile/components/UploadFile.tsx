import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {uploadFileAction} from "@/components/uploadFile/services/uploadFile.actions";
import {z} from "zod";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {errorToast, successToast} from "@/lib/utils/core.function";

const UploadFileObject = z.object({
    combustibleId: z.number(),
});

export function UploadFileComponent() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleUpload = async () => {
        await uploadFileAction({
            files: files,
        }).then((response) => {
            successToast(response.data);
            setFiles([]);
            setIsDialogOpen(false);
        }).catch((error: any) => {
            errorToast(error.response.data.message);
        });
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className=""
                >
                    <Plus className="h-4 pe-2"/>
                    Nuevo
                </Button>
            </DialogTrigger>
            <DialogDescription/>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Agregar Archivo
                    </DialogTitle>
                </DialogHeader>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="file">Archivo</Label>
                    <Input
                        id="file"
                        type="file"
                        multiple
                        onChange={(e) => setFiles([...files, ...Array.from(e.target.files as FileList)])}
                    />
                </div>

                <Button
                    onClick={() => handleUpload()}
                >
                    Guardar Archivos
                </Button>
            </DialogContent>
        </Dialog>
    )
}
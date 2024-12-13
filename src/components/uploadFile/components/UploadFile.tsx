import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import {deleteFileFromDrive, uploadFileAction} from "@/components/uploadFile/services/uploadFile.actions";
import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {FileInput, ImageUp, Trash2, LoaderCircle, Download, ExternalLink} from "lucide-react";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export interface UploadFileProps {
    type: string,
    id: number,
    handleClose: () => void,
    filesUploaded?: UploadFileResponse[]
}

export function UploadFileComponent({type, id, handleClose, filesUploaded}: UploadFileProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string>("");


    const handleUpload = async () => {
        setLoading(true);
        await uploadFileAction({
            files: files,
            type,
            id,
        }).then((response) => {
            successToast(response.data);
            setFiles([]);
            setIsDialogOpen(false);
        }).catch((error: any) => {
            errorToast(error.response.data.message);
        });
        handleClose();
        setLoading(false);
    }

    const handleClickDelete = (fileId: string) => {
        setIsDeleteDialogOpen(true);
        setFileToDelete(fileId);
    }

    const handleDeleteFile = async (fileId: string) => {
        setDeleteLoading(true);
        await deleteFileFromDrive(fileId).then(() => {
            successToast("Archivo eliminado correctamente");
        }).catch((error: any) => {
            errorToast(error.response.data.message);
        });
        setIsDeleteDialogOpen(false);
        setDeleteLoading(false);
        handleClose();
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="h-7 w-7"
                    size="icon"
                >
                    <ImageUp className="h-3.5"/>
                </Button>
            </DialogTrigger>
            <DialogDescription className="hidden"/>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Gestionar Archivos
                    </DialogTitle>
                </DialogHeader>

                <div className="grid w-full items-center gap-8">
                    <div className="grid max-w-md items-center gap-1.5">
                        {
                            filesUploaded && filesUploaded.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 w-full ">
                                    <Button
                                        onClick={() => window.open(file.streamLink)}
                                        className="text-xs text-start max-w-80 w-full gap-2 h-8 flex justify-start"
                                        size={"sm"}
                                        variant="outline"
                                    >
                                        <ExternalLink className="h-3.5"/>
                                        <p className="overflow-hidden text-nowrap text-ellipsis m-0">
                                            {file.name}
                                        </p>
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        size={"icon"}
                                        className={"h-8 w-10"}
                                        onClick={() => window.open(file.downloadLink)}
                                    >
                                        <Download className="h-3.5"/>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size={"icon"}
                                        className={"h-8 w-10"}
                                        onClick={() => handleClickDelete(file.id)}
                                    >
                                        <Trash2 className="h-3.5 text-red-500"/>
                                    </Button>

                                </div>
                            ))
                        }
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="file">Archivos</Label>
                        <Input
                            id="file"
                            type="file"
                            multiple
                            onChange={(e) => setFiles([...files, ...Array.from(e.target.files as FileList)])}
                        />
                    </div>
                </div>

                <Button
                    onClick={() => handleUpload()}
                    disabled={files.length === 0 || loading}
                >
                    <LoaderCircle className={`h-4 me-2 ${loading ? "animate-spin" : "hidden"}`}/>
                    Guardar Archivos
                </Button>

                {/*    MODAL DELETE*/}
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogTrigger asChild>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar Archivo</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer, ¿Estás seguro de eliminar este
                                archivo?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className={buttonVariants({variant: "destructive"})}
                                onClick={() => handleDeleteFile(fileToDelete)}
                            >
                                <LoaderCircle className={`h-4 me-2 ${deleteLoading ? "animate-spin" : "hidden"}`}/>
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
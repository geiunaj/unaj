"use client";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {SelectItem} from "@radix-ui/react-select";
import {useState} from "react";
import {X} from "lucide-react";
import {Plus} from 'lucide-react';


export default function CombustionPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-row justify-between items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-xl text-foreground font-bold">Refrigerantes</h1>
                    <h2 className="text-base text-muted-foreground">Huella de carbono</h2>
                </div>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="default" className=" text-white">
                            <Plus/>
                            Registrar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md border-2">
                        <AlertDialogHeader className="flex flex-row justify-between">
                            <AlertDialogCancel
                                className="absolute right-0 top-0 bg-transparent hover:bg-transparent border-none shadow-none">
                                <X className="h-6 w-6"/>
                            </AlertDialogCancel>
                        </AlertDialogHeader>
                        {/* <FormFertilizantes /> */}
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
                <Select>
                    <SelectTrigger className="rounded-sm h-10 w-80 focus:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Selecciona la Sede"/>
                    </SelectTrigger>
                    <SelectContent className="border-none">
                        <SelectGroup>
                            <SelectItem value="1">Sede 1</SelectItem>
                            <SelectItem value="2">Sede 2</SelectItem>
                            <SelectItem value="3">Sede 3</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className=" font-Manrope text-sm font-bold text-center">
                                SEDE
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                TIPO DE FERTILIZANTE
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FERTILIZANTE
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                CNT. DE FERTILIZANTE
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                % DE NITROGENO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FICHA TECNICA

                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="text-center">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="flex space-x-4 justify-center items-center bg-transparent ">
                                <Button
                                    size="icon"
                                    className="bg-transparent hover:bg-transparent text-blue-700 border"
                                >
                                    <Pencil1Icon className="h-4 text-blue-700"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

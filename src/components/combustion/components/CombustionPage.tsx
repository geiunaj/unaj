"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Pencil1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { SelectItem } from "@radix-ui/react-select";
import { useState } from "react";
import { FormCombustion } from "./FormCombustion";

export default function CombustionPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-[1440px] h-full p-6 m-auto rounded-2xl">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="text-gray-600 font-Manrope">
          <h1 className="text-2xl font-bold">COMBUSTION ESTACIONARIA</h1>
          <h2 className="text-lg">Huella de carbono</h2>
        </div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="default" className="bg-blue-800 text-white">
              Registrar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md border-2">
            <AlertDialogHeader className="flex flex-row justify-between">
              <AlertDialogCancel className="h-4 bg-transparent hover:bg-transparent border-none">
                {/* <X className="h-5 hover:text-[--darkOrange]" /> */}
              </AlertDialogCancel>
            </AlertDialogHeader>
            <FormCombustion />
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
        <Select>
          <SelectTrigger className="rounded-sm h-10 w-80 focus:outline-none focus-visible:ring-0">
            <SelectValue placeholder="Selecciona la Sede" />
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
              <TableHead className="font-Manrope text-sm font-bold text-center">
                SEDE
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE EQUIPO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE GAS
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                UNIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                MES
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                AÑO
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
                  <Pencil1Icon className="h-4 text-blue-700" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

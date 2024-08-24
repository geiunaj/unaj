import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {ArrowLeftFromLine, ArrowRightFromLine, FileSpreadsheet, FileText} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React from "react";

interface ReportPopoverProps {
    onClick: (data: ReportRequest) => void;
    withMonth?: boolean;
    yearFrom?: string;
    yearTo?: string;
    from?: string;
    to?: string;
    handleYearFromChange?: (value: string) => void;
    handleYearToChange?: (value: string) => void;
}

export interface ReportRequest {
    from?: string;
    to?: string;
    yearFrom?: string;
    yearTo?: string;
}

const Report = z.object({
    // format yyyy-MM
    from: z.string().optional(),
    to: z.string().optional(),
    yearFrom: z.string().optional(),
    yearTo: z.string().optional(),
});


export default function ReportComponent({
                                            onClick,
                                            withMonth = false,
                                            yearFrom,
                                            yearTo,
                                            from,
                                            to,
                                            handleYearFromChange,
                                            handleYearToChange,
                                        }: ReportPopoverProps) {
    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            from: "",
            to: "",
            yearFrom: yearFrom,
            yearTo: yearTo,
        },
    });

    const anios = useQuery({
        queryKey: ['anios'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false
    });

    const onSubmit = async (data: z.infer<typeof Report>) => {
        const reportRequest: ReportRequest = {
            from: data.from,
            to: data.to,
            yearFrom: data.yearFrom,
            yearTo: data.yearTo,
        };
        onClick(reportRequest);
    };

    if (anios.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex gap-3"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {
                            withMonth ? (
                                <div className="w-full flex flex-col items-center gap-3">
                                    <FormField
                                        control={form.control}
                                        name="from"
                                        render={({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Desde</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="h-7"
                                                        placeholder="2023-01"
                                                        type="month"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="to"
                                        render={({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Hasta</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="col-span-3"
                                                        placeholder="2024-01"
                                                        type="month"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ) : (
                                <div className="w-full flex items-center gap-3">
                                    <FormField
                                        name="yearFrom"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className="w-full">
                                                <Select
                                                    onValueChange={handleYearFromChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="w-full">
                                                        <SelectTrigger className="rounded-sm h-7 text-xs w-auto gap-2 ">
                                                            <ArrowLeftFromLine className="h-3 w-3"/>
                                                            <SelectValue placeholder="Desde"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <FormMessage/>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem className="text-xs" value="all">
                                                                Todos
                                                            </SelectItem>
                                                            {anios.data!.map((clase) => (
                                                                <SelectItem key={clase.nombre}
                                                                            value={clase.nombre.toString()}>
                                                                    {clase.nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="yearTo"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className="w-full">
                                                <Select
                                                    onValueChange={handleYearToChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="w-full">
                                                        <SelectTrigger className="rounded-sm h-7 text-xs w-auto gap-2">
                                                            <ArrowRightFromLine className="h-3 w-3"/>
                                                            <SelectValue placeholder="Hasta"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <FormMessage/>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem className="text-xs" value="all">
                                                                Todos
                                                            </SelectItem>
                                                            {anios.data!.map((clase) => (
                                                                <SelectItem key={clase.nombre}
                                                                            value={clase.nombre.toString()}>
                                                                    {clase.nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )
                        }

                        <div className="flex justify-end w-full gap-4">
                            {/* <Button
                                variant="secondary"
                                type="submit"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-3.5 w-3.5"/>
                                PDF
                            </Button> */}
                            <Button
                                type="submit"
                                size="sm"
                                className="flex items-center gap-2 h-7"
                            >
                                <FileSpreadsheet className="h-3.5 w-3.5"/>
                                Excel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
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
import {FileSpreadsheet, FileText} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React from "react";

interface ReportPopoverProps {
    onClick: (data: ReportRequest) => void;
    withMonth?: boolean;
}

export interface ReportRequest {
    from?: string;
    to?: string;
}

export const formatPeriod = (period: ReportRequest): string => {
    if (period.from && period.to) {
        return `Desde ${period.from} hasta ${period.to}`;
    }
    if (period.from) {
        return `Desde ${period.from}`;
    }
    if (period.to) {
        return `Hasta ${period.to}`;
    }
    return "-";
}

const Report = z.object({
    // format yyyy-MM
    from: z.string().optional(),
    to: z.string().optional(),
    yearFrom: z.string().optional(),
    yearTo: z.string().optional(),
});


export default function ReportPopover({
                                          onClick,
                                          withMonth
                                      }: ReportPopoverProps) {
    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            from: "",
            to: "",

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
        };
        onClick(reportRequest);
    };

    if (anios.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className=""
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {
                            withMonth ? (
                                <div className="w-full flex flex-col items-center gap-3">
                                    <FormField
                                        name="yearFrom"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className="grid grid-cols-4 space-y-0 items-center">
                                                <FormLabel>Desde</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="w-full col-span-3">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleciona la clase"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <FormMessage/>
                                                    <SelectContent>
                                                        <SelectGroup>
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
                                        control={form.control}
                                        name="to"
                                        render={({field}) => (
                                            <FormItem className="grid grid-cols-4 space-y-0 items-center">
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
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="from"
                                        render={({field}) => (
                                            <FormItem className="grid grid-cols-4 space-y-0 items-center">
                                                <FormLabel>Desde</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="col-span-3"
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
                                            <FormItem className="grid grid-cols-4 space-y-0 items-center">
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
                            )
                        }

                        {/*<div className="flex items-center gap-4">*/}
                        {/*    <Switch*/}
                        {/*        checked={all}*/}
                        {/*        onCheckedChange={setAll}*/}
                        {/*        id="airplane-mode"*/}
                        {/*    />*/}
                        {/*    <Label htmlFor="airplane-mode">Usar filtros activos</Label>*/}
                        {/*</div>*/}

                        <div className="flex justify-end w-full gap-4">
                            <Button
                                variant="secondary"
                                type="submit"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-3.5 w-3.5"/>
                                PDF
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="flex items-center gap-2"
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
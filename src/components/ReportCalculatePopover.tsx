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
import {FileSpreadsheet, FileText, FileUp} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React from "react";
import {getSedes} from "@/components/sede/services/sede.actions";

interface ReportCalculatePopoverProps {
    onClick: (data: ReportCalculateRequest) => void;
    onClickExport: (data: ReportCalculateRequest) => void;
}

export interface ReportCalculateRequest {
    from?: string;
    to?: string;
    sedeId?: string;
}

const Report = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    sedeId: z.string().optional(),
});


export default function ReportCalculatePopover({onClick, onClickExport}: ReportCalculatePopoverProps) {
    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            from: "",
            to: "",
            sedeId: "",
        },
    });

    const sedeQuery = useQuery({
        queryKey: ['sedesRCP'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof Report>) => {
        const reportRequest: ReportCalculateRequest = {
            from: data.from,
            to: data.to,
            sedeId: data.sedeId,
        };
        onClick(reportRequest);
    };

    const handleExport = () => {
        onClickExport(form.getValues());
    }

    if (sedeQuery.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="w-full flex flex-col items-center gap-3">
                            <FormField
                                control={form.control}
                                name="from"
                                render={({field}) => (
                                    <FormItem className="w-full grid grid-cols-4 space-y-0 items-center">
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
                                    <FormItem className="w-full grid grid-cols-4 space-y-0 items-center">
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

                            <FormField
                                name="sedeId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="w-full grid grid-cols-4 space-y-0 items-center">
                                        <FormLabel>Sede</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl className="col-span-3">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleciona tu sede"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {sedeQuery.data!.map((sede) => (
                                                        <SelectItem key={sede.id} value={sede.id.toString()}>
                                                            {sede.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="flex justify-end w-full gap-4">
                            <Button
                                type="button"
                                size="sm"
                                className="flex items-center gap-2"
                                variant="secondary"
                                onClick={handleExport}
                            >
                                <FileUp className="h-3.5 w-3.5"/>
                                Exportar
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-3.5 w-3.5"/>
                                Generar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
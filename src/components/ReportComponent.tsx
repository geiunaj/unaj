import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {forwardRef, useImperativeHandle} from "react";
import {ReportRequest} from "@/lib/interfaces/globals";

interface ReportPopoverProps {
    onSubmit: (data: ReportRequest) => void;
    withMonth?: boolean;
    yearFrom?: string;
    yearTo?: string;
    from?: string;
    to?: string;
    handleFromChange?: (value: string) => void;
    handleToChange?: (value: string) => void;
    handleYearFromChange?: (value: string) => void;
    handleYearToChange?: (value: string) => void;
}

const Report = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    yearFrom: z.string().optional(),
    yearTo: z.string().optional(),
});

const ReportComponent = forwardRef(function ReportComponent(
    {
        onSubmit,
        withMonth = false,
        yearFrom,
        yearTo,
        from,
        to,
        handleFromChange,
        handleToChange,
        handleYearFromChange,
        handleYearToChange,
    }: ReportPopoverProps,
    ref
) {
    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            from: from,
            to: to,
            yearFrom: yearFrom,
            yearTo: yearTo,
        },
    });

    const anios = useQuery({
        queryKey: ['anios'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false
    });

    const handleFormSubmit = (data: z.infer<typeof Report>) => {
        const reportRequest: ReportRequest = {
            from: data.from,
            to: data.to,
            yearFrom: data.yearFrom,
            yearTo: data.yearTo,
        };
        onSubmit(reportRequest);
    };

    const submitForm = () => {
        form.handleSubmit(handleFormSubmit)();
    };

    useImperativeHandle(ref, () => ({
        submitForm,
    }));

    if (anios.isLoading) {
        return <div>Loading...</div>;
    }

    const handleChangeFrom = (value: string) => {
        form.setValue('from', value);
        if (handleFromChange) {
            handleFromChange(value);
        }
    }

    const handleChangeTo = (value: string) => {
        form.setValue('to', value);
        if (handleToChange) {
            handleToChange(value);
        }
    }

    const handleChangeYearFrom = (value: string) => {
        form.setValue('yearFrom', value);
        if (handleYearFromChange) {
            handleYearFromChange(value);
        }
    };

    const handleChangeYearTo = (value: string) => {
        form.setValue('yearTo', value);
        if (handleYearToChange) {
            handleYearToChange(value);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {
                            withMonth ? (
                                <div
                                    className="flex w-full flex-col gap-1 sm:flex-row sm:w-full sm:items-center sm:gap-2">
                                    <FormField
                                        control={form.control}
                                        name="from"
                                        render={() => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        className="h-7 text-xs"
                                                        placeholder="2023-01"
                                                        type="month"
                                                        defaultValue={form.watch('from')}
                                                        onChange={(e) => handleChangeFrom(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="to"
                                        render={() => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        className="h-7 text-xs"
                                                        placeholder="2024-01"
                                                        type="month"
                                                        defaultValue={form.watch('to')}
                                                        onChange={(e) => handleChangeTo(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="flex w-full flex-col gap-1 sm:flex-row sm:w-full sm:items-center sm:gap-2">
                                    <FormField
                                        name="yearFrom"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className="w-full">
                                                <Select
                                                    onValueChange={handleChangeYearFrom}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="w-full">
                                                        <SelectTrigger className="rounded-sm h-7 text-xs w-full gap-2">
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
                                                    onValueChange={handleChangeYearTo}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="w-full">
                                                        <SelectTrigger className="rounded-sm h-7 text-xs w-full gap-2">
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
                    </form>
                </Form>
            </div>
        </div>
    );
});

export default ReportComponent;
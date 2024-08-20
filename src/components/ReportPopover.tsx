import {Button} from "@/components/ui/button";
import React, {useState} from "react";
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
import {addYears, format} from "date-fns"
import {Input} from "@/components/ui/input";
import Exceljs from "exceljs";

interface ReportPopoverProps {
    onClick: (data: ReportRequest) => void;
    text?: string;
}

export interface ReportRequest {
    from?: string;
    to?: string;
}

const Report = z.object({
    // format yyyy-MM
    from: z.string().optional(),
    to: z.string().optional(),
});


export default function ReportPopover({
                                          onClick,
                                          text
                                      }: ReportPopoverProps) {

    const [from, setFrom] = useState(format(addYears(new Date(), -1), "yyyy-MM"));
    const [to, setTo] = useState(format(new Date(), "yyyy-MM"));

    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            from: "",
            to: "",

        },
    });

    const onSubmit = async (data: z.infer<typeof Report>) => {
        const reportRequest: ReportRequest = {
            from: data.from,
            to: data.to,
        };
        onClick(reportRequest);
    };


    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-ful flex flex-col items-center gap-3"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
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
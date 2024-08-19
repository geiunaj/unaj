import {Button} from "@/components/ui/button";
import React from "react";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {CalendarIcon, FileSpreadsheet, FileText} from "lucide-react";
import {addDays, addYears, format} from "date-fns"
import {DateRange, Matcher} from "react-day-picker"
import {Calendar} from "@/components/ui/calendar"
import {cn} from "@/lib/utils"

interface ReportPopoverProps {
    onClick: (data: ReportRequest) => void;
    text?: string;
}

interface ReportRequest {
    date: DateRange;
}

const Report = z.object({
    date: z.object({
        from: z.date(),
        to: z.date().optional(),
    } as DateRange),
});

export default function ReportPopover({
                                          onClick,
                                          text
                                      }: ReportPopoverProps) {

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addYears(new Date(), -1) ?? new Date(),
        to: new Date(),
    })

    const form = useForm<z.infer<typeof Report>>({
        resolver: zodResolver(Report),
        defaultValues: {
            date: date,
        },
    });

    const onSubmit = async (data: z.infer<typeof Report>) => {
        const reportRequest: ReportRequest = {
            date: data.date
        };
        console.log(reportRequest);
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
                            name="date"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Rango de Fechas</FormLabel>
                                    <div className={cn("grid gap-2")}>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[300px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {date?.from ? (
                                                        date.to ? (
                                                            <>
                                                                {format(date.from, "LLL dd, y")} -{" "}
                                                                {format(date.to, "LLL dd, y")}
                                                            </>
                                                        ) : (
                                                            format(date.from, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={field.value as DateRange | undefined}
                                                    onSelect={setDate}
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-end w-full gap-2">
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
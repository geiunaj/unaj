"use client"

import {TrendingUp} from "lucide-react"
import {Bar, BarChart, CartesianGrid, Rectangle, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {SummaryItem} from "@/components/resumen/service/resumen.interface";

const chartConfig = {
    totalEmissions: {
        label: "Emisiones",
    },
    categoria1: {
        label: "Cat. 1",
        color: "hsl(var(--chart-1))",
    },
    categoria2: {
        label: "Cat. 2",
        color: "hsl(var(--chart-2))",
    },
    categoria3: {
        label: "Cat. 3",
        color: "hsl(var(--chart-3))",
    },
    categoria4: {
        label: "Cat. 4",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export const VerticalBarChart = ({chartData, itemWithMaxEmission, yearFrom, yearTo}: {
    chartData: SummaryItem[],
    itemWithMaxEmission: SummaryItem,
    yearFrom: string,
    yearTo: string,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gráfico de Categorías [tCO2eq]</CardTitle>
                <CardDescription className="text-xs">Enero {yearFrom} - Diciembre {yearTo}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="chart"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Bar
                            dataKey="totalEmissions"
                            strokeWidth={2}
                            radius={8}
                            activeIndex={2}
                            activeBar={({...props}) => {
                                return (
                                    <Rectangle
                                        {...props}
                                        fillOpacity={0.8}
                                        stroke={props.payload.fill}
                                        strokeDasharray={4}
                                        strokeDashoffset={4}
                                    />
                                )
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1">
                <div className="flex gap-2 font-medium leading-none text-sm">
                    {`${itemWithMaxEmission.emissionSource} fue la mayor con ${itemWithMaxEmission.totalEmissions} tCO2eq`}
                    <TrendingUp className="h-4 w-4"/>
                </div>
                <div className="leading-none text-muted-foreground text-xs">
                    Mostrando las emisiones de CO2
                </div>
            </CardFooter>
        </Card>
    )
}

"use client"

import {TrendingUp} from "lucide-react"
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from "recharts"

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

const chartData = [
    {emissionSource: "January", totalEmissions: 186, mobile: 80},
    {emissionSource: "February", totalEmissions: 305, mobile: 200},
    {emissionSource: "March", totalEmissions: 237, mobile: 120},
    {emissionSource: "April", totalEmissions: 73, mobile: 190},
    {emissionSource: "May", totalEmissions: 209, mobile: 130},
    {emissionSource: "June", totalEmissions: 214, mobile: 140},
]

const chartConfig = {
    totalEmissions: {
        label: "Total Emisiones",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

export const LineChart = ({chartData, itemWithMaxEmission, yearFrom, yearTo}: {
    chartData: SummaryItem[],
    itemWithMaxEmission: SummaryItem,
    yearFrom: string,
    yearTo: string,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gráfico de Fuentes de Emisión</CardTitle>
                <CardDescription>Enero {yearFrom} - Diciembre {yearTo}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false}/>
                        <YAxis
                            dataKey="emissionSource"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="totalEmissions" type="number" hide/>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line"/>}
                        />
                        <Bar
                            dataKey="totalEmissions"
                            layout="vertical"
                            fill="var(--color-totalEmissions)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="totalEmissions"
                                position="right"
                                offset={4}
                                className="fill-foreground"
                                fontSize={10}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-xs">
                <div className="flex gap-2 font-medium leading-none">
                    {`${itemWithMaxEmission.emissionSource} fue la mayor con ${itemWithMaxEmission.totalEmissions} tCO2eq`}
                    <TrendingUp className="h-4 w-4"/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Mostrando las emisiones de CO2
                </div>
            </CardFooter>
        </Card>
    )
}

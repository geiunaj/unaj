"use client"
import {TrendingUp} from "lucide-react"
import {LabelList, Pie, PieChart} from "recharts"

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
    ChartContainer, ChartLegend, ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {SummaryItem} from "@/components/resumen/service/resumen.interface";

const chartData = [
    {emissionSource: "chrome", generalContributions: 275, fill: "var(--color-categoria1)"},
    {emissionSource: "safari", generalContributions: 200, fill: "var(--color-safari)"},
    {emissionSource: "firefox", generalContributions: 187, fill: "var(--color-firefox)"},
    {emissionSource: "edge", generalContributions: 173, fill: "var(--color-edge)"},
    {emissionSource: "other", generalContributions: 90, fill: "var(--color-other)"},
]

const chartConfig = {
    generalContributions: {
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

export const PieChartComponent = ({chartData, itemWithMaxEmission, yearFrom, yearTo}: {
    chartData: SummaryItem[],
    itemWithMaxEmission: SummaryItem,
    yearFrom: string,
    yearTo: string,
}) => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-start pb-2">
                <CardTitle>Gráfico de Categorías [%]</CardTitle>
                <CardDescription className="text-xs">Enero {yearFrom} - Diciembre {yearTo}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="generalContributions" hideLabel/>}
                        />
                        <Pie data={chartData} label dataKey="generalContributions" nameKey="chart">
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="chart"/>}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

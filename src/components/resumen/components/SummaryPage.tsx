"use client";
import {useSedes, useSummary, useYears} from "@/components/resumen/lib/resumen.hook";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {SummaryItem} from "@/components/resumen/service/resumen.interface";
import SkeletonTable from "@/components/Layout/skeletonTable";
import SelectFilter from "@/components/SelectFilter";
import {ArrowLeftFromLine, ArrowRightFromLine, Building, Calendar, FileSpreadsheet} from "lucide-react";
import usePageTitle from "@/lib/stores/titleStore.store";
import {LineChart} from "@/components/resumen/components/LineChart";
import {PieChartComponent} from "@/components/resumen/components/PieChart";
import {VerticalBarChart} from "@/components/resumen/components/VerticalBarChart";
import {ChangeTitle} from "@/components/TitleUpdater";
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {formatPeriod} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import {uploadFileAction} from "@/components/uploadFile/services/uploadFile.actions";
import {UploadFileComponent} from "@/components/uploadFile/components/UploadFile";

export default function SummaryPage() {
    ChangeTitle("Resumen");
    const logo = "/img/GIEGEI.png";
    const completePathOfLogo = process.env.NEXAUTH_URL + logo;

    const [selectedSede, setSelectedSede] = useState<string>("");
    const [selectedYearFrom, setSelectedYearFrom] = useState<string>(new Date().getFullYear().toString());
    const [selectedYearTo, setSelectedYearTo] = useState<string>((new Date().getFullYear()).toString());

    const resumen = useSummary({
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        from: selectedYearFrom,
        to: selectedYearTo
    });

    const resumenReport = useSummary({
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        from: selectedYearFrom,
        to: selectedYearTo
    });
    const sedes = useSedes();
    const years = useYears();

    const handleSedeChange = useCallback(async (value: string) => {
        await setSelectedSede(value);
        await resumen.refetch();
    }, [resumen]);

    const handleSelectedYearFrom = useCallback(async (value: string) => {
        await setSelectedYearFrom(value);
        await resumen.refetch();
        await resumenReport.refetch();
    }, [resumen, setSelectedYearFrom]);

    const handleSelectedYearTo = useCallback(async (value: string) => {
        await setSelectedYearTo(value);
        await resumen.refetch();
        await resumenReport.refetch();
    }, [resumen, setSelectedYearTo]);

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "FUENTE DE EMISIÓN", key: "emissionSource", width: 30,},
            {header: "EMISIONES DE CO2 [tCO2eq]", key: "co2Emissions", width: 30,},
            {header: "EMISIONES DE CH4 [tCO2eq]", key: "ch4Emissions", width: 30,},
            {header: "EMISIONES DE N2O [tCO2eq]", key: "N2OEmissions", width: 30,},
            {header: "EMISIONES DE HFC [tCO2eq]", key: "hfcEmissions", width: 30,},
            {header: "TOTAL DE EMISIONES [tCO2eq]", key: "totalEmissions", width: 30,},
            {header: "CONTRIBUCIONES", key: "generalContributions", width: 30,},
        ];
        await setSelectedYearFrom(period.yearFrom ?? "");
        await setSelectedYearTo(period.yearTo ?? "");
        const data = await resumen.refetch();
        await GenerateReport(data.data!, columns, formatPeriod(period, false), `RESUMEN DE EMISIONES`, `RESUMEN ${period.yearFrom}-${period.yearTo}`);
    }

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (resumen.isLoading || sedes.isLoading || years.isLoading) {
        return <SkeletonTable/>;
    }

    if (new Date().getDay() === 11) {
        console.log(new Date().getDay());
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
                <div className="flex flex-col items-end w-full gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">

                            <UploadFileComponent/>

                            <SelectFilter
                                list={sedes.data!}
                                itemSelected={selectedSede}
                                handleItemSelect={handleSedeChange}
                                value={"id"}
                                nombre={"name"}
                                id={"id"}
                                icon={<Building className="h-3 w-3"/>}
                                all={true}
                            />

                            <ReportComponent
                                onSubmit={handleClickExcelReport}
                                ref={submitFormRef}
                                withMonth={false}
                                yearFrom={selectedYearTo}
                                yearTo={selectedYearTo}
                                handleYearFromChange={handleSelectedYearFrom}
                                handleYearToChange={handleSelectedYearTo}
                            />
                        </div>
                        <div className="flex flex-col-reverse justify-end gap-1 w-full sm:flex-row sm:gap-2">
                            <Button
                                onClick={handleClick}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-2 h-7"
                            >
                                <FileSpreadsheet className="h-3.5 w-3.5"/>
                                Excel
                            </Button>

                            <ExportPdfReport
                                data={resumenReport.data!}
                                fileName={`RESUMEN ${formatPeriod({
                                    yearFrom: selectedYearFrom,
                                    yearTo: selectedYearTo
                                } as ReportRequest, false)}.pdf`}
                                columns={[
                                    {header: "FUENTE DE EMISIÓN", key: "emissionSource", width: 30,},
                                    {header: "EMISIONES DE  CO2 [tCO2eq]", key: "co2Emissions", width: 10,},
                                    {header: "EMISIONES DE  CH4 [tCO2eq]", key: "ch4Emissions", width: 10,},
                                    {header: "EMISIONES DE  N2O [tCO2eq]", key: "N2OEmissions", width: 10,},
                                    {header: "EMISIONES DE  HFC [tCO2eq]", key: "hfcEmissions", width: 10,},
                                    {header: "TOTAL DE  EMISIONES [tCO2eq]", key: "totalEmissions", width: 20,},
                                    {header: "CONTRIBUCIONES", key: "generalContributions", width: 10,},
                                ]}
                                rows={25}
                                title={`RESUMEN DE EMISIONES`}
                                period={formatPeriod({
                                    yearFrom: selectedYearFrom,
                                    yearTo: selectedYearTo
                                } as ReportRequest, false)}
                            />


                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full border rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                FUENTE DE EMISIÓN
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                EMISIONES DE <br/> CO2 <span className="text-[8px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                EMISIONES DE <br/> CH4 <span className="text-[8px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                EMISIONES DE <br/> N2O <span className="text-[8px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                EMISIONES DE <br/> HFC <span className="text-[8px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                TOTAL DE <br/> EMISIONES <span className="text-[8px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="font-Manrope text-[13px] font-bold text-center py-1">
                                CONTRIBUCIONES <br/> <span className="text-[8px]">[%]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resumen.data!.map(
                            (item: SummaryItem, index: number) => (
                                <TableRow key={item.emissionSource + index.toString()}
                                          className={`text-center ${item.category ? "bg-accent" : ""}`}
                                >
                                    <TableCell
                                        className={`text-[13px] text-start p-1 ${item.category ? "font-bold" : ""}`}>
                                        {item.emissionSource}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 pe-6">
                                        {item.co2Emissions.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 pe-6">
                                        {item.ch4Emissions.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 pe-6">
                                        {item.N2OEmissions.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 pe-6">
                                        {item.hfcEmissions.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 font-bold pe-6">
                                        {item.totalEmissions.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-end p-1 pe-6">
                                        {item.generalContributions.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="grid gap-6 mt-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <LineChart
                    chartData={resumen.data!.filter(
                        (item) => item.category !== true
                    )}
                    itemWithMaxEmission={resumen.data!.filter(
                        (item) => item.totalEmissions === resumen.data!.reduce(
                            (acc, item) => (item.totalEmissions > acc && item.category !== true ? item.totalEmissions : acc),
                            0
                        ) && item.category !== true
                    )[0]}
                    yearFrom={selectedYearFrom}
                    yearTo={selectedYearTo}
                />


                <VerticalBarChart
                    chartData={resumen.data!.filter(
                        (item) => item.category === true && item.emissionSource !== "Emisiones Totales" && item.generalContributions !== 0
                    )}
                    itemWithMaxEmission={resumen.data!.filter(
                        (item) => item.totalEmissions === resumen.data!.reduce(
                            (acc, item) => (item.totalEmissions > acc && item.category !== true ? item.totalEmissions : acc),
                            0
                        ) && item.category !== true
                    )[0]}
                    yearFrom={selectedYearFrom}
                    yearTo={selectedYearTo}
                />

                <PieChartComponent
                    chartData={resumen.data!.filter(
                        (item) => item.category === true && item.emissionSource !== "Emisiones Totales" && item.generalContributions !== 0
                    )}
                    itemWithMaxEmission={resumen.data!.filter(
                        (item) => item.totalEmissions === resumen.data!.reduce(
                            (acc, item) => (item.totalEmissions > acc && item.category !== true ? item.totalEmissions : acc),
                            0
                        ) && item.category !== true
                    )[0]}
                    yearFrom={selectedYearFrom}
                    yearTo={selectedYearTo}
                />

            </div>
        </div>
    );
}

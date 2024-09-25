import React from 'react';
import {pdf} from '@react-pdf/renderer';
import ReportDocument from "@/lib/utils/GeneratePdfReport";
import {Button} from "@/components/ui/button";
import {FileText} from "lucide-react";

interface Column {
    header: string;
    key: string;
    width: number;
}

interface ExportPdfReportProps {
    fileName: string;
    data: Record<string, any>[];  // Asegúrate de que esto sea un arreglo de objetos
    columns: Column[];
    title: string;
    period: string;
    rows?: number;
}

const ExportPdfReport: React.FC<ExportPdfReportProps> = ({fileName, data, columns, title, period, rows}) => {
    var FileSaver = require('file-saver');
    const handleExportPdf = async () => {
        const doc = await pdf((
            <ReportDocument title={title} period={period} data={data} columns={columns} rows={rows}/>))
            .toBlob();
        FileSaver.saveAs(doc, `${fileName}.pdf`);
    };

    return (
        <Button onClick={handleExportPdf} variant="outline" className="h-7 text-xs w-full sm:w-fit gap-2">
            <FileText className="w-3.5 h-3.5"/>
            <span>PDF</span>
        </Button>
    );

};

export default ExportPdfReport;

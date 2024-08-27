import React from 'react';
import {PDFDownloadLink} from '@react-pdf/renderer';
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
    return (
        <div>
            <PDFDownloadLink
                document={<ReportDocument data={data} columns={columns} title={title} period={period} rows={rows}/>}
                fileName={`${fileName}.pdf`}
            >
                {({blob, url, loading, error}) =>
                    loading ? (
                        <Button className="h-7 text-xs w-full gap-2" variant="outline" disabled={true}>
                            <FileText className="w-3.5 h-3.5"/>
                            PDF
                        </Button>
                    ) : (
                        <Button className="h-7 text-xs w-full gap-2" variant="outline">
                            <FileText className="w-3.5 h-3.5"/>
                            PDF
                        </Button>
                    )
                }
            </PDFDownloadLink>
        </div>
    );
};

export default ExportPdfReport;

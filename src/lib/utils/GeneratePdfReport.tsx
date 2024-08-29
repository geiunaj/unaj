import React from 'react';
import {
    Page,
    Text,
    Image,
    Svg,
    Defs,
    View,
    Rect,
    Stop,
    Document,
    StyleSheet,
    PDFDownloadLink,
    LinearGradient,
    Font
} from '@react-pdf/renderer';
import {Button} from "@/components/ui/button";
import {FileText} from "lucide-react";

Font.register({
    family: 'Inter-Bold',
    src: '/fonts/Inter_28pt-Bold.ttf',
});

Font.register({
    family: 'Inter-Medium',
    src: '/fonts/Inter_24pt-Medium.ttf',
});

Font.register({
    family: 'Inter-SemiBold',
    src: '/fonts/Inter_28pt-SemiBold.ttf',
});

Font.register({
    family: 'Inter',
    src: '/fonts/Inter_18pt-Regular.ttf',
});

const styles = StyleSheet.create({
    table: {
        fontFamily: "Inter",
        display: "flex",
        width: "100%",
        marginTop: "20px",
        paddingHorizontal: "30px",
    },
    tableHeader: {
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#0844C9",
        color: "#FFFFFF",
        fontFamily: "Inter-SemiBold",
        height: "24px",
        fontSize: 10,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2
    },
    tableRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderStyle: "solid",
        borderColor: "#e2e8f0",
        height: "20px",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    tableCell: {
        fontSize: 10,
    },
    pageNumber: {
        fontSize: 10,
        textAlign: "center",
        marginBottom: 10,
        position: "absolute",
        bottom: 20,
        width: "100%",
    },
    pageHeader: {
        height: "60px",
        position: "relative",
        width: "100%",
    },
    headerText: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "white",
        fontFamily: "Inter-Bold"
    },
    footer: {
        position: "absolute",
        bottom: 0,
        height: "20px",
        width: "100%",
        backgroundColor: "#0844C9"
    },
});

interface Column {
    header: string;
    key: string;
    width: number;
}

interface ReportDocumentProps {
    data: Record<string, any>[];
    columns: Column[];
    title: string;
    period: string;
    rows?: number;
}

const ReportDocument: React.FC<ReportDocumentProps> = ({data, columns, title, period, rows}) => {
    const rowsPerPage = rows ?? 15;
    const numberOfPages = Math.ceil(data.length / rowsPerPage);

    // Create an array of page numbers
    const pageNumbers = Array.from({length: numberOfPages}, (_, i) => i);

    const renderTable = (pageNumber: number) => {
        const startIndex = pageNumber * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = data.slice(startIndex, endIndex);

        return (
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    {columns.map((column, index) => (
                        <View style={{...styles.tableCol, width: `${column.width}%`}} key={index}>
                            <Text style={styles.tableCell}>{column.header}</Text>
                        </View>
                    ))}
                </View>
                {pageData.map((row, rowIndex) => (
                    <View style={styles.tableRow} key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <View style={{...styles.tableCol, width: `${column.width}%`}} key={colIndex}>
                                <Text style={styles.tableCell}>{row[column.key]}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <Document>
            {pageNumbers.map((pageNumber) => (
                <Page size="A4" orientation="landscape" key={pageNumber}>
                    <View style={styles.pageHeader}>
                        <Svg
                            width="842"
                            height="100%"
                            style={{position: "absolute", top: 0, left: 0}}
                        >
                            <Defs>
                                <LinearGradient id="linearGradientId" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#0134A5"/>
                                    <Stop offset="100%" stopColor="#0844C9"/>
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" fill="url(#linearGradientId)"/>
                        </Svg>
                        <View style={{
                            height: "60px",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: "30px",
                            position: "relative",
                        }}>
                            <Image
                                src={"/img/UNAJWhite.png"}
                                style={{width: "120px", height: "36px"}}
                            />
                            <Text style={styles.headerText}>
                                CALCULADORA DE HUELLA ECOLÓGICA
                            </Text>
                            <Text> </Text>
                        </View>
                    </View>
                    <View style={{
                        height: "20px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                    }}>
                        <Text
                            style={{fontSize: "13px", fontWeight: "bold", color: "#05153d", fontFamily: "Inter-Bold"}}>
                            {title}
                        </Text>
                    </View>
                    <View style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "flex-start",
                        paddingLeft: "30px",
                    }}>
                        <Text style={{fontSize: "10px", fontWeight: "bold", color: "#05153d", fontFamily: "Inter"}}>
                            {period}
                        </Text>
                    </View>

                    {renderTable(pageNumber)}

                    <Text style={styles.pageNumber}>
                        Página {pageNumber + 1} de {numberOfPages}
                    </Text>
                    <View style={styles.footer}/>
                </Page>
            ))}
        </Document>
    );
};

export default ReportDocument;

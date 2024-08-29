import Exceljs from "exceljs";

export interface Column {
    header: string;
    key: string;
    width: number;
}

export default async function GenerateReport<T>(data: T[], columns: Column[], period: string, title: string, sheetName: string) {
    const workbook = new Exceljs.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    sheet.properties.defaultRowHeight = 22;
    sheet.properties.showGridLines = false;

    sheet.mergeCells(1, 1, 1, columns.length);
    sheet.mergeCells(2, 2, 2, 3);
    const cellPeriodTitle = sheet.getRow(2).getCell(1);
    cellPeriodTitle.value = 'PERIODO';
    cellPeriodTitle.font = {
        color: {argb: '0A2A70'},
        size: 12,
        bold: true,
    };
    cellPeriodTitle.alignment = {
        vertical: 'middle',
        horizontal: 'center',
    };
    const cellPeriod = sheet.getRow(2).getCell(2);
    cellPeriod.value = period;
    cellPeriod.font = {
        color: {argb: '0A2A70'},
        size: 12,
        italic: true,
    };
    cellPeriod.alignment = {
        vertical: 'middle',
        horizontal: 'left',
    };
    const cellTitle = sheet.getRow(1).getCell(1);
    cellTitle.value = title;
    cellTitle.font = {
        color: {argb: '0A2A70'},
        size: 18,
        bold: true,
    };
    cellTitle.alignment = {
        vertical: 'middle',
        horizontal: 'center',
    };

    columns.forEach((column, index) => {
        sheet.getColumn(index + 1).width = column.width;
        const headerRow = sheet.getRow(3);
        const cell = headerRow.getCell(index + 1);
        cell.value = column.header;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: '2563EB'},
        };
        cell.font = {
            color: {argb: 'FFFFFF'},
            size: 12,
            bold: true,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
    });

    data.forEach((row: any, rowIndex) => {
        const excelRow = sheet.getRow(rowIndex + 4);
        columns.forEach((column, columnIndex) => {
            const cell = excelRow.getCell(columnIndex + 1);
            if (columnIndex === 0) {
                cell.value = rowIndex + 1;
            } else {
                cell.value = row[column.key];
            }
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
            };
            cell.border = {
                top: {style: 'thin', color: {argb: 'e2e8f0'}},
                left: {style: 'thin', color: {argb: 'e2e8f0'}},
                bottom: {style: 'thin', color: {argb: 'e2e8f0'}},
                right: {style: 'thin', color: {argb: 'e2e8f0'}}
            };
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title + (period === '-' ? '' : `_${period}`) + '.xlsx';
    a.click();
    URL.revokeObjectURL(url);
}

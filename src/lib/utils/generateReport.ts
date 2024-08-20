import Exceljs from "exceljs";

export interface Column {
    header: string;
    key: string;
    width: number;
}

export default async function GenerateReport<T>(data: T[], columns: Column[]) {
    const workbook = new Exceljs.Workbook();
    const sheet = workbook.addWorksheet('PRUEBA');
    sheet.properties.defaultRowHeight = 25;
    sheet.properties.showGridLines = false;

    sheet.columns = columns.map((column: Column) => {
        return {header: column.header, key: column.key, width: column.width};
    });

    columns.forEach((column, index) => {
        const cell = sheet.getCell(1, index + 1);
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
        const excelRow = sheet.getRow(rowIndex + 2);
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
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    a.click();
    URL.revokeObjectURL(url);
}

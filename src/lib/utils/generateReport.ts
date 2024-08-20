import Exceljs from "exceljs";

export default async function GenerateReport<T>(data: T[], columns: string[]) {
    const workbook = new Exceljs.Workbook();
    const sheet = workbook.addWorksheet('PRUEBA');
    sheet.properties.defaultRowHeight = 25;
    sheet.properties.showGridLines = false;


    sheet.columns = columns.map((column) => {
        return {header: column, key: column, width: 20};
    });

    columns.forEach((column, index) => {
        sheet.getCell(1, index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: '2563EB'},
        };

        sheet.getCell(1, index + 1).font = {
            color: {argb: 'FFFFFF'},
            size: 14,
        };

        sheet.getCell(1, index + 1).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
    });

    data.forEach((row: any, rowIndex) => {
        columns.forEach((column, columnIndex) => {
            if (columnIndex === 0) {
                sheet.getCell(rowIndex, columnIndex).value = rowIndex + 1;
                sheet.getCell(rowIndex, columnIndex).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                };
            }
            sheet.getCell(rowIndex, columnIndex).value = row[columnIndex];
            sheet.getCell(rowIndex, columnIndex).alignment = {
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
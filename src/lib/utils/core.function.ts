import {toast} from "sonner";
import {ReportRequest} from "@/components/ReportComponent";

export const successToast = (body: string, description: string = new Date().toLocaleString()) => {
    return toast.success(body, {
        description: description,
        action: {
            label: "Listo",
            onClick: () => toast.dismiss(),
        },
    });
}

export const errorToast = (body: string = "Error", description: string = new Date().toLocaleString()) => {
    return toast.error(body, {
        description: description,
        action: {
            label: "Cerrar",
            onClick: () => toast.dismiss(),
        },
    });
}


export const formatPeriod = (period: ReportRequest, withMonth = false) => {
    period.from = period.from !== 'all' ? period.from : "";
    period.to = period.to !== 'all' ? period.to : "";
    period.yearFrom = period.yearFrom !== 'all' ? period.yearFrom : "";
    period.yearTo = period.yearTo !== 'all' ? period.yearTo : "";
    console.log(period);
    if (withMonth) {
        if (period.from && period.to) {
            return `Desde ${period.from} hasta ${period.to}`;
        }
        if (period.from) {
            return `Desde ${period.from}`;
        }
        if (period.to) {
            return `Hasta ${period.to}`;
        }
    } else {
        if (period.yearFrom && period.yearTo) {
            return `Desde ${period.yearFrom} hasta ${period.yearTo}`;
        }
        if (period.yearFrom) {
            return `Desde ${period.yearFrom}`;
        }
        if (period.yearTo) {
            return `Hasta ${period.yearTo}`;
        }
    }
    return "-";
}
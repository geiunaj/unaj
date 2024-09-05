import {toast} from "sonner";
import {ReportRequest} from "@/lib/interfaces/globals";

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
    if (withMonth) {
        if (period.from && period.to) {
            return `DESDE ${period.from} HASTA ${period.to}`;
        }
        if (period.from) {
            return `DESDE ${period.from}`;
        }
        if (period.to) {
            return `HASTA ${period.to}`;
        }
    } else {
        if (period.yearFrom && period.yearTo) {
            return `DESDE ${period.yearFrom} HASTA ${period.yearTo}`;
        }
        if (period.yearFrom) {
            return `DESDE ${period.yearFrom}`;
        }
        if (period.yearTo) {
            return `HASTA ${period.yearTo}`;
        }
    }
    return "-";
}
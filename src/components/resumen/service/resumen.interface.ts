export interface SummaryItem {
    emissionSource?: string;
    co2Emissions: number;
    ch4Emissions: number;
    N2OEmissions: number;
    hfcEmissions: number;
    totalEmissions: number;
    generalContributions: number;
    category?: boolean;
    chart?: string;
    fill?: string;
}
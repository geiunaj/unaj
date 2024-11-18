export interface SummaryItem {
    emissionSource?: string;
    co2Emissions: number;
    ch4Emissions: number;
    n20Emissions: number;
    hfcEmissions: number;
    totalEmissions: number;
    generalContributions: number;
    category?: boolean;
}
export interface CityPriceRecord {
    currency: string;
    unit: string;
    average: number;
    updated_at: string;
    note?: string;
}
export interface PriceResult {
    city: string;
    normalizedCity: string;
    average: number;
    currency: string;
    unit: string;
    updatedAt: string;
    source: string;
    confidence: number;
    message?: string;
}
export declare function getAveragePrice(city: string): PriceResult;
export declare function listSupportedCities(): string[];

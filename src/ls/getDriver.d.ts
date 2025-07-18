export function identifyVendor(dsnName: string): Promise<string>;
export function getDsnDriverInfo(dsnName: string): Promise<{ driverPath: string; driverId: number | null }>;
export function getDriverNameFromDll(dllPath: string): Promise<string>;
export function matchToVendor(driverName: string, dllPath: string, driverId: number | null): string | null;

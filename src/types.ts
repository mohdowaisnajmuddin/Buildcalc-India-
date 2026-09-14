export type CityId = 'hyderabad' | 'bangalore' | 'mumbai' | 'delhi_ncr';

export type MaterialGrade = 'standard' | 'premium' | 'luxury';

export type SoilType = 'normal' | 'sandy_rocky' | 'black_cotton' | 'clayey';

export interface CityRate {
  cityId: CityId;
  cityName: string;
  state: string;
  baseRatePerSqft: number; // in INR per sqft for standard turnkey construction
  gstRate: number; // 0.18 for 18%
  lastUpdated: string;
  pwdScheduleCode: string;
  notes: string;
}

export interface MaterialGradeConfig {
  id: MaterialGrade;
  name: string;
  multiplier: number;
  description: string;
  cement: string;
  steel: string;
  flooring: string;
  fittings: string;
}

export interface SoilConfig {
  id: SoilType;
  name: string;
  surchargePercent: number;
  foundationType: string;
  description: string;
}

export interface EstimateInput {
  city: CityId;
  areaSqft: number;
  floors: number;
  materialGrade: MaterialGrade;
  soilType: SoilType;
}

export interface EstimateBreakdown {
  baseCost: number;
  structureAndCivil: number;
  finishingAndMep: number;
  soilSurcharge: number;
  soilSurchargePercent: number;
  floorAdjustment: number;
  floorFactor: number;
  wastageCost: number;
  wastagePercent: number;
  subtotalPreTax: number;
  gstCost: number;
  gstRatePercent: number;
  totalCost: number;
  effectiveRatePerSqft: number;
}

export interface EstimateResponse {
  city: CityId;
  cityName: string;
  areaSqft: number;
  floors: number;
  materialGrade: MaterialGrade;
  soilType: SoilType;
  estimatedCost: number;
  confidenceRange: [number, number]; // [low, high]
  modelVersion: string;
  ratesLastUpdated: string;
  evalScores: {
    maeScore: number;
    rmseScore: number;
  };
  sampleSize: number;
  breakdown: EstimateBreakdown;
  generatedAt: string;
}

export interface ModelMetadata {
  versionId: string;
  trainedAt: string;
  algorithm: string;
  features: string[];
  maeScore: number;
  rmseScore: number;
  sampleSize: number;
  servingChoice: string;
  tradeoffDocumentation: string;
  dataSource: string;
  ratesLastUpdated: string;
}

export interface TrainingDataRow {
  rowId: string;
  city: CityId;
  areaSqft: number;
  floors: number;
  materialGrade: MaterialGrade;
  soilType: SoilType;
  actualCost: number;
  source: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google';
  signedInAt: string;
}

export interface SavedEstimate {
  id: string;
  userId: string;
  input: EstimateInput;
  totalCost: number;
  confidenceRange: [number, number];
  cityName: string;
  savedAt: string;
}

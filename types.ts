
export interface CompetitorData {
  id: string;
  name: string;
  bookingPrice: number;
  rating: number;
  occupancy: number; 
  adr: number;
  revpar: number;
}

export interface SegmentData {
  rooms: number;
  adr: number;
}

export interface RoomSegment {
  name: string;
  type: string;
  rooms: number;
  currentOccupancy: number;
  basePrice: number;
  recommendedPrice: number;
}

export interface ActualPerformance {
  date?: string;
  startDate?: string;
  endDate?: string;
  roomRevenue: number;
  totalOccupancy: number;
  segments: {
    ota: SegmentData;
    corporate: SegmentData;
    individual: SegmentData;
  };
}

export interface ActualPerformanceRecord extends ActualPerformance {
  id: string;
  timestamp: string;
}

export interface HistoricalSTRData {
  id: string;
  period: string;
  mpi: number;
  ari: number;
  rgi: number;
  occupancy: number;
  adr: number;
}

export interface PricingRecommendation {
  segment: string;
  currentPrice: number;
  suggestedPrice: number;
  demandLevel: 'Low' | 'Medium' | 'High' | 'Peak';
  reasoning: string;
  impact: string;
}

export type AppTab = 'dashboard' | 'pricing' | 'str' | 'compset' | 'actuals' | 'segmentation';

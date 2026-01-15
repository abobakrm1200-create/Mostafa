
import { CompetitorData, RoomSegment, ActualPerformance, HistoricalSTRData } from './types';

export const COMP_SET_INITIAL: CompetitorData[] = [
  { id: '1', name: 'جوديان العليا (Golden Tulip)', bookingPrice: 550, rating: 8.4, occupancy: 72, adr: 540, revpar: 388.8 },
  { id: '2', name: 'هوليداي ان القصر', bookingPrice: 620, rating: 8.2, occupancy: 78, adr: 610, revpar: 475.8 },
  { id: '3', name: 'بريرا العليا', bookingPrice: 710, rating: 8.6, occupancy: 85, adr: 690, revpar: 586.5 },
  { id: '4', name: 'نوفوتيل العليا', bookingPrice: 580, rating: 8.1, occupancy: 65, adr: 560, revpar: 364 },
];

export const OVAD_SEGMENTS: RoomSegment[] = [
  { name: 'Standard King - OTA', type: 'OTA', rooms: 50, currentOccupancy: 75, basePrice: 480, recommendedPrice: 480 },
  { name: 'Deluxe - Corporate', type: 'Corporate', rooms: 40, currentOccupancy: 45, basePrice: 550, recommendedPrice: 550 },
  { name: 'Executive - Individual', type: 'Individual', rooms: 30, currentOccupancy: 30, basePrice: 950, recommendedPrice: 950 },
  { name: 'Junior Suite - Mixed', type: 'OTA', rooms: 23, currentOccupancy: 40, basePrice: 1100, recommendedPrice: 1100 },
];

export const FINANCIALS_CONST = {
  monthlyOpEx: 750000,
  annualFixedCosts: 3500000,
  totalRooms: 143,
};

export const ACTUAL_PERFORMANCE_MOCK: ActualPerformance = {
  date: new Date().toISOString().split('T')[0],
  roomRevenue: 85400,
  totalOccupancy: 68,
  segments: {
    ota: { rooms: 40, adr: 520 },
    corporate: { rooms: 20, adr: 650 },
    individual: { rooms: 8, adr: 950 }
  }
};

// Added id property to match HistoricalSTRData interface
export const HISTORICAL_STR_MOCK: HistoricalSTRData[] = [
  { id: 'mtd-1', period: 'الشهر الحالي (MTD)', mpi: 104.2, ari: 98.5, rgi: 102.7, occupancy: 74.5, adr: 585 },
  { id: 'last-month-2', period: 'الشهر الماضي', mpi: 101.5, ari: 96.2, rgi: 97.6, occupancy: 71.2, adr: 560 },
  { id: 'last-year-3', period: 'نفس الشهر (العام الماضي)', mpi: 98.4, ari: 94.1, rgi: 92.6, occupancy: 68.8, adr: 535 },
];

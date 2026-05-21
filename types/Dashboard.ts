// types/admin.ts
export interface DashboardData {
    stats: {
      totalPredictions: number;
      activePatients: number;
      apiUptime: string;
      securityStatus: string;
    };
    trafficData: { name: string; visits: number; api_calls: number }[];
    riskData: { name: string; value: number; color: string }[];
    recentPatients: {
      id: string;
      name: string;
      age: number;
      mmse: number;
      risk: string;
      date: string;
    }[];
    doctorsList: {
      id: string;
      name: string;
      spec: string;
      status: string;
      patients: number;
    }[];
  }
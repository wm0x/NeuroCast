export interface PredictionResult {
    predicted_delta_mmse: number;
    composite_risk_score: number;
    risk_stratification: {
      category: string;
      code: string;
      color: string;
      description: string;
      monitoring: string;
      threshold: string;
    };
    gene_contributions: {
      symbol: string;
      contribution: number;
      weight: number;
      expression: number;
    }[];
    model_info: {
      loocv_mae: number;
      training_cohort: string;
    };
    status?: string;
  }
  
  export interface VisitRecord {
    id: string;
    visitDate: string;
    ageAtVisit: number;
    mmse: number;
    cdrsb: number;
    hippocampusVol: number;
    prediction: string;
  }
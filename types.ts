export interface Axis {
  name: string;
  score: number;
}

export interface Domain {
  name: string;
  axes: Axis[];
}

export interface EvaluationData {
  educatorName: string;
  domains: Domain[];
}

export interface EvaluationRecord {
  date: string;
  data: EvaluationData;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  belbinRolesAnalysis: string;
}

export interface ChartData {
  subject: string;
  score: number;
  fullMark: number;
}
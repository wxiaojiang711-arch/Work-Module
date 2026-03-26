export interface QaSession {
  id: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastQuestion: string;
  lastAnswerId: string;
}

export type TimeRange = "7d" | "30d" | "quarter" | "custom";

export interface KpiItem {
  key: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
  trend: "up" | "down" | "stable";
  status: "red" | "yellow" | "green";
}

export interface RiskItem {
  id: string;
  title: string;
  level: "red" | "yellow";
  impact: string;
  reason: string;
  suggestion: string;
  taskId?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  linkedRiskId?: string;
}

export interface ChartData {
  trendData: { date: string; value: number }[];
  rankData: { name: string; value: number }[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: "definition" | "rule" | "lineage" | "change";
  content: string;
  updatedAt: string;
  responsible: string;
}

export interface TrustInfo {
  consistency: "consistent" | "conflict";
  conflictDetails?: string;
  freshness: string;
  completeness: "complete" | "incomplete";
  incompleteReason?: string;
}

export interface QaAnswer {
  id: string;
  question: string;
  timeRange: TimeRange;
  customTimeRange?: [string, string];
  summary: string[];
  kpis: KpiItem[];
  charts: ChartData;
  risks: RiskItem[];
  actions: ActionItem[];
  evidence: {
    definitions: EvidenceItem[];
    rules: EvidenceItem[];
    lineage: EvidenceItem[];
    changes: EvidenceItem[];
  };
  trust: TrustInfo;
  createdAt: string;
}

export interface ReportTaskPayload {
  taskName: string;
  targetOrg: string;
  assistOrgs?: string[];
  deadline: string;
  urgency: "normal" | "urgent" | "critical";
  relatedTopics: string[];
  template: "quality" | "conflict" | "delay" | "sharing";
  templateFields: Record<string, unknown>;
  attachedSummary: string;
  attachedEvidenceIds: string[];
  linkedRiskId?: string;
}

export interface ReportTaskResult {
  success: boolean;
  taskId: string;
  message?: string;
}

export type BatchTaskMode = "single" | "batch";

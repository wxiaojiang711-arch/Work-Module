export type UpdateFrequency = string;
export type DrawerTabKey = "metadata" | "tags" | "relations" | "versions";

export interface VersionRecord {
  id: string;
  version: string;
  timestamp: string;
  operator: string;
  summary: string;
}

export interface RelatedAsset {
  id: string;
  name: string;
}

export interface DataAsset {
  id: string;
  fileName: string;
  sourceUnit: string;
  updateFrequency: UpdateFrequency;
  issuedAt: string;
  lastUpdated: string;
  owner: string;
  fileType: "CSV" | "Excel" | "API" | "PDF" | "Word";
  createdAt: string;
  updateCycle: string;
  summary: string;
  keywords: string[];
  openness: string;
  tags: string[];
  relationships: RelatedAsset[];
  versions: VersionRecord[];
  knowledgeBaseRefs: string[];
}

export interface KnowledgeNode {
  key: string;
  title: string;
  category: "root" | "unit" | "topic";
}

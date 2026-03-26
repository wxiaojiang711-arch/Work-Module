export type KnowledgeBaseType = "unit" | "theme";
export type Visibility = "组织内公开" | "部分公开" | "完全公开" | "仅管理员可见";
export type UnitCategory = "department" | "town" | "soe";

export interface KnowledgeBase {
  id: string;
  title: string;
  lastUpdated: string;
  description: string;
  visibility: Visibility;
  itemCount: number;
  type: KnowledgeBaseType;
  unitCategory?: UnitCategory;
  tags: string[];
}
